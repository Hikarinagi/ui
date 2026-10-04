import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { basename, dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import ts from 'typescript'

const root = fileURLToPath(new URL('../', import.meta.url))
const source = join(root, 'src')
const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? files(path) : [path]
  })
}

test('shared source imports stay within the layer or approved framework-independent dependencies', () => {
  const allowed = new Set([
    '@internationalized/date',
    '@internationalized/number',
    'clsx',
    'tailwind-merge',
    'shiki',
    'tailwind-variants',
    'uqr',
  ])
  for (const file of files(source).filter(file => file.endsWith('.ts'))) {
    const tree = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true)
    const inspect = node => {
      let specifier
      if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node))
        specifier = node.moduleSpecifier
      if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument))
        specifier = node.argument.literal
      if (ts.isCallExpression(node)) {
        const dynamic = node.expression.kind === ts.SyntaxKind.ImportKeyword
        const required = ts.isIdentifier(node.expression) && node.expression.text === 'require'
        assert.ok(!required, `Unexpected require: ${file}`)
        if (dynamic) specifier = node.arguments[0]
      }
      if (specifier) {
        assert.ok(ts.isStringLiteral(specifier), `Unresolved import: ${file}`)
        const name = specifier.text
        if (name.startsWith('.')) {
          const target = resolve(dirname(file), name)
          assert.ok(
            target.startsWith(source + sep),
            `Import escapes shared source: ${file}: ${name}`,
          )
        } else {
          const owner = name.startsWith('@')
            ? name.split('/').slice(0, 2).join('/')
            : name.split('/')[0]
          assert.ok(
            allowed.has(owner),
            `Framework or undeclared abstraction dependency: ${file}: ${name}`,
          )
          assert.ok(manifest.dependencies[owner], `Missing dependency: ${owner}`)
        }
      }
      ts.forEachChild(node, inspect)
    }
    inspect(tree)
  }
})

test('shared source contains no framework components or primitive CSS bindings', () => {
  for (const file of files(source)) {
    if (basename(file) === 'LICENSE') continue
    assert.ok(/\.(ts|css)$/.test(file), `Unexpected shared source: ${relative(root, file)}`)
    const content = readFileSync(file, 'utf8')
    if (!relative(source, file).startsWith(`primitives${sep}`))
      assert.doesNotMatch(content, /--(?:reka|radix)-|data-(?:reka|radix)-/)
    assert.doesNotMatch(content, /@source[^;]*(?:\.vue|packages\/vue|packages\/react)/)
  }
})

test('the internal workspace layer is bundled into each framework package, never published', () => {
  assert.equal(manifest.private, true)
  for (const adapter of ['vue', 'react']) {
    const framework = JSON.parse(readFileSync(join(root, `../${adapter}/package.json`), 'utf8'))
    assert.equal(framework.dependencies[manifest.name], undefined)
    assert.equal(framework.devDependencies[manifest.name], 'workspace:*')
    for (const [name, version] of Object.entries(manifest.dependencies))
      assert.equal(
        framework.dependencies[name],
        version,
        `Bundled shared dependency must be available to ${adapter} consumers: ${name}`,
      )
  }
})
