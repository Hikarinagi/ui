import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const library = join(root, 'packages/vue')
const temporary = mkdtempSync(join(tmpdir(), 'hina-package-consumer-'))
const json = path => JSON.parse(readFileSync(path, 'utf8'))

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
  cpSync(join(root, 'scripts/package-consumer'), temporary, { recursive: true })
  const tools = [
    'vue',
    'typescript',
    'vue-tsc',
    'vite',
    '@vitejs/plugin-vue',
    'tailwindcss',
    '@tailwindcss/vite',
  ]
  const dependencies = Object.fromEntries(
    tools.map(name => [name, json(join(library, 'node_modules', name, 'package.json')).version]),
  )
  dependencies['@types/web-bluetooth'] = json(
    join(library, 'node_modules/@vueuse/core/package.json'),
  ).dependencies['@types/web-bluetooth']
  dependencies['@hina-ui/vue'] = `file:./${packages[0]}`
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
  run('node', ['ssr.mjs'])
  run('node', ['node_modules/vue-tsc/bin/vue-tsc.js', '--noEmit', '-p', 'tsconfig.json'])
  run('node', ['node_modules/vite/bin/vite.js', 'build'])
  const assets = join(temporary, 'dist/assets')
  const css = readdirSync(assets)
    .filter(name => name.endsWith('.css'))
    .map(name => readFileSync(join(assets, name), 'utf8'))
    .join('\n')
  for (const token of [
    '--hn-accent',
    '--hn-control-h-md',
    '.hn-interactive',
    '.hn-table-resize-label',
    '.hn-navigation-viewport',
    '.hn-slider-move',
  ])
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
