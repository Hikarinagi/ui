import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const targets = {
  vue: {
    fixture: 'scripts/package-consumer',
    tools: [
      'vue',
      'typescript',
      'vue-tsc',
      'vite',
      '@vitejs/plugin-vue',
      'tailwindcss',
      '@tailwindcss/vite',
    ],
    typecheck: ['node_modules/vue-tsc/bin/vue-tsc.js', '--noEmit', '-p', 'tsconfig.json'],
    extra: library => ({
      '@types/web-bluetooth': json(join(library, 'node_modules/@vueuse/core/package.json'))
        .dependencies['@types/web-bluetooth'],
    }),
    styles: [
      '--hn-accent',
      '--hn-control-h-md',
      '.hn-interactive',
      '.hn-table-resize-label',
      '.hn-navigation-viewport',
      '.hn-slider-move',
    ],
  },
  react: {
    fixture: 'scripts/package-consumer-react',
    tools: [
      'react',
      'react-dom',
      '@types/react',
      '@types/react-dom',
      'typescript',
      'vite',
      '@vitejs/plugin-react',
      'tailwindcss',
      '@tailwindcss/vite',
    ],
    typecheck: ['node_modules/typescript/bin/tsc', '--noEmit', '-p', 'tsconfig.json'],
    extra: () => ({}),
    styles: ['--hn-accent', '--hn-control-h-md', '.hn-interactive', '.hn-scroll-area'],
  },
}
const adapter = process.argv[2] ?? 'vue'
const target = targets[adapter]
if (!target) throw new Error(`Unknown framework package: ${adapter}`)
const library = join(root, 'packages', adapter)
const temporary = mkdtempSync(join(tmpdir(), `hina-package-consumer-${adapter}-`))
const json = path => JSON.parse(readFileSync(path, 'utf8'))
const specifiers =
  /\b(?:from|import|require)\s*\(?\s*(["'])([^"'\r\n]+)\1|<reference\s+(?:path|types)\s*=\s*(["'])([^"'\r\n]+)\3/g
const unshippable = specifier =>
  specifier === '@hina-ui/shared' ||
  specifier.startsWith('@hina-ui/shared/') ||
  /(?:^|\/)node_modules\//.test(specifier)

function shippedModules(directory) {
  return readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile() && /\.(?:d\.[cm]?ts|[cm]?js)$/.test(entry.name))
    .map(entry => join(entry.parentPath, entry.name))
    .filter(file => !relative(directory, file).split(sep).includes('node_modules'))
}

function run(command, args, cwd = temporary, capture = false) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: capture ? 'pipe' : 'inherit',
    env: { ...process.env, NODE_PATH: '' },
    shell: process.platform === 'win32',
  })
  if (result.error) throw result.error
  if (result.status !== 0) {
    if (capture) process.stderr.write(`${result.stdout ?? ''}${result.stderr ?? ''}`)
    throw new Error(`${command} ${args.join(' ')} failed (${result.status})`)
  }
  return result.stdout
}

try {
  run('pnpm', ['pack', '--pack-destination', temporary], library, true)
  const packages = readdirSync(temporary).filter(name => name.endsWith('.tgz'))
  assert.equal(packages.length, 1, 'Expected one packed library')
  cpSync(join(root, target.fixture), temporary, { recursive: true })
  const dependencies = Object.fromEntries(
    target.tools.map(name => [
      name,
      json(join(library, 'node_modules', name, 'package.json')).version,
    ]),
  )
  Object.assign(dependencies, target.extra(library))
  dependencies[`@hina-ui/${adapter}`] = `file:./${packages[0]}`
  writeFileSync(
    join(temporary, 'package.json'),
    JSON.stringify(
      { name: 'hina-package-consumer', private: true, type: 'module', dependencies },
      null,
      2,
    ),
  )
  console.log(`Installing tarball into ${temporary}`)
  run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'])
  const installed = join(temporary, `node_modules/@hina-ui/${adapter}`)
  const distribution = join(installed, 'dist')
  const modules = shippedModules(installed)
  const leaks = modules.flatMap(file =>
    [...readFileSync(file, 'utf8').matchAll(specifiers)]
      .map(match => match[2] ?? match[4])
      .filter(unshippable)
      .map(specifier => `${relative(installed, file)}: ${specifier}`),
  )
  assert.deepEqual(
    leaks,
    [],
    'Shipped modules must not reference @hina-ui/shared or a node_modules path',
  )
  const runtime = modules
    .filter(file => /\.[cm]?js$/.test(file))
    .map(file => readFileSync(file, 'utf8'))
    .join('\n')
  assert.ok(
    !/from\s*["']overlayscrollbars["']/.test(runtime),
    'Scrollbar runtime must include the workspace patch',
  )
  assert.ok(
    readFileSync(join(distribution, 'overlayscrollbars.LICENSE'), 'utf8').includes('MIT License'),
  )
  run('node', ['ssr.mjs'])
  run('node', target.typecheck)
  run('node', ['node_modules/vite/bin/vite.js', 'build'])
  const assets = join(temporary, 'dist/assets')
  const css = readdirSync(assets)
    .filter(name => name.endsWith('.css'))
    .map(name => readFileSync(join(assets, name), 'utf8'))
    .join('\n')
  for (const token of target.styles)
    assert.ok(css.includes(token), `Missing compiled style: ${token}`)
  assert.ok(
    readdirSync(assets).some(name => name.endsWith('.js')),
    'Missing client bundle',
  )
  console.log('Package consumer passed: exports, declarations, CSS, client bundle and Node SSR.')
} finally {
  assert.equal(dirname(temporary), tmpdir())
  rmSync(temporary, { recursive: true, force: true })
}
