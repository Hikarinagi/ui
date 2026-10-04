import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { components } from '../../shared/nav.ts'

const site = fileURLToPath(new URL('..', import.meta.url))
const content = fileURLToPath(new URL('../../content/', import.meta.url))
const demoRoot = join(site, 'demos')
const pageRoot = join(demoRoot, 'pages')
const groups = { 'zh-CN': '(zh)', en: 'en' }

function walk(directory, extension) {
  if (!existsSync(directory)) return []
  return readdirSync(directory).flatMap(name => {
    const path = join(directory, name)
    if (statSync(path).isDirectory()) return walk(path, extension)
    return name.endsWith(extension) ? [path] : []
  })
}

function write(path, text) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, text)
}

function importPath(from, to) {
  const path = relative(dirname(from), to).replace(/\.tsx?$/, '')
  return path.startsWith('.') ? path : `./${path}`
}

function playgroundsOf(source) {
  const names = [...source.matchAll(/<Playground\b[^>]*?\bname="([^"]+)"/g)].map(match => match[1])
  return [...new Set(names)]
}

function demosOf(source) {
  const names = [...source.matchAll(/<Demo\s+name="([^"]+)"/g)].map(match => match[1])
  for (const [, slug] of source.matchAll(/<CategoryGrid\s+slug="([^"]+)"/g))
    for (const item of components.filter(entry => entry.category === slug))
      names.push(`${item.to.slice(item.to.lastIndexOf('/') + 1)}/hero`)
  return [...new Set(names)]
}

rmSync(pageRoot, { recursive: true, force: true })
for (const group of Object.values(groups))
  for (const file of walk(join(site, 'app', group), 'page.tsx')) rmSync(file)

let routes = 0
const wrappers = new Set()
for (const [locale, group] of Object.entries(groups)) {
  const pages = [
    '',
    ...walk(join(content, locale), '.md').map(file =>
      relative(join(content, locale), file).replace(/\.md$/, ''),
    ),
  ]
  for (const path of pages) {
    const source = path ? readFileSync(join(content, locale, `${path}.md`), 'utf8') : ''
    const names = demosOf(source).filter(name => existsSync(join(demoRoot, locale, `${name}.tsx`)))
    const playgrounds = playgroundsOf(source)
    for (const name of playgrounds) wrappers.add(name)
    const map = join(pageRoot, locale, `${path || 'index'}.ts`)
    const demoEntries = names.map((name, index) => `\n    '${name}': Demo${index},`).join('')
    const playgroundEntries = playgrounds.map(name => `${name}: ${name}Playground`).join(', ')
    write(
      map,
      [
        "import type { PageModules } from '~/lib/demo-map'",
        ...names.map(
          (name, index) =>
            `import Demo${index} from '${importPath(map, join(demoRoot, locale, `${name}.tsx`))}'`,
        ),
        ...playgrounds.map(
          name => `import ${name}Playground from '~/demos/pages/playgrounds/${name}'`,
        ),
        '',
        'export const modules: PageModules = {',
        `  demos: {${demoEntries}${names.length ? '\n  ' : ''}},`,
        `  playgrounds: {${playgroundEntries ? ` ${playgroundEntries} ` : ''}},`,
        '}',
        '',
      ].join('\n'),
    )
    const page = join(site, 'app', group, path, 'page.tsx')
    if (!path) {
      write(
        page,
        [
          "import { Landing } from '~/components/Landing'",
          "import reactPackage from '../../../../packages/react/package.json'",
          '',
          'export default function Page() {',
          `  return <Landing locale="${locale}" version={reactPackage.version} />`,
          '}',
          '',
        ].join('\n'),
      )
      routes += 1
      continue
    }
    write(
      page,
      [
        "import { DocRoute, docMetadata } from '~/lib/doc-route'",
        `import { modules } from '~/demos/pages/${locale}/${path || 'index'}'`,
        '',
        'export function generateMetadata() {',
        `  return docMetadata('${locale}', '${path}')`,
        '}',
        '',
        'export default function Page() {',
        `  return <DocRoute locale="${locale}" path="${path}" modules={modules} />`,
        '}',
        '',
      ].join('\n'),
    )
    routes += 1
  }
}

for (const name of wrappers)
  write(
    join(pageRoot, 'playgrounds', `${name}.tsx`),
    [
      "'use client'",
      '',
      `import { ${name} } from '@hina-ui/react'`,
      "import { Playground, type PlaygroundProps } from '~/components/Playground'",
      '',
      `export default function ${name}Playground(props: PlaygroundProps) {`,
      `  return <Playground {...props} component={${name}} />`,
      '}',
      '',
    ].join('\n'),
  )

const svgLiteral = path =>
  readFileSync(fileURLToPath(new URL(path, import.meta.url)), 'utf8')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
write(
  join(site, 'components', 'wordmark-svg.ts'),
  [
    `export const wordmarkSvg =\n  '${svgLiteral('../../shared/hina-wordmark.svg')}'`,
    `export const hikarinagiSvg =\n  '${svgLiteral('../../shared/hikarinagi-wordmark.svg')}'`,
    '',
  ].join('\n\n'),
)

console.log(`Generated ${routes} routes`)
