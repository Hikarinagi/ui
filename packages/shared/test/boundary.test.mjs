import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
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
  const allowed = new Set(['clsx', 'tailwind-merge', 'tailwind-variants', 'uqr'])
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
        assert.ok(!dynamic && !required, `Unexpected runtime module loading: ${file}`)
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
          assert.ok(
            allowed.has(name),
            `Framework or undeclared abstraction dependency: ${file}: ${name}`,
          )
          assert.ok(manifest.dependencies[name], `Missing dependency: ${name}`)
        }
      }
      ts.forEachChild(node, inspect)
    }
    inspect(tree)
  }
})

test('shared source contains no framework components or primitive CSS bindings', () => {
  for (const file of files(source)) {
    assert.ok(/\.(ts|css)$/.test(file), `Unexpected shared source: ${relative(root, file)}`)
    const content = readFileSync(file, 'utf8')
    assert.doesNotMatch(content, /--(?:reka|radix)-|data-(?:reka|radix)-/)
    assert.doesNotMatch(content, /@source[^;]*(?:\.vue|packages\/vue|packages\/react)/)
  }
})

test('the internal workspace layer is not a published Vue dependency', () => {
  const vue = JSON.parse(readFileSync(join(root, '../vue/package.json'), 'utf8'))
  assert.equal(manifest.private, true)
  assert.equal(vue.dependencies[manifest.name], undefined)
  assert.equal(vue.devDependencies[manifest.name], 'workspace:*')
  for (const [name, version] of Object.entries(manifest.dependencies))
    assert.equal(
      vue.dependencies[name],
      version,
      `Bundled shared dependency must be available to consumers: ${name}`,
    )
})
