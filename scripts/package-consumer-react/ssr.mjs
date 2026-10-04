import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createElement as h } from 'react'
import { renderToString } from 'react-dom/server'
import * as ui from '@hina-ui/react'

assert.equal(typeof window, 'undefined')
assert.equal(typeof document, 'undefined')
const manifestURL = import.meta.resolve('@hina-ui/react/package.json')
const manifest = JSON.parse(readFileSync(fileURLToPath(manifestURL), 'utf8'))
const root = dirname(fileURLToPath(manifestURL))
assert.equal(manifest.dependencies['@hina-ui/shared'], undefined)
assert.ok(existsSync(resolve(root, 'dist/shared/variants/button.ts')))
assert.ok(existsSync(resolve(root, 'dist/types/shared/src/variants/button.d.ts')))
const esm = resolve(root, 'dist/esm/react/src')
const directive = path => readFileSync(resolve(esm, path), 'utf8').startsWith('"use client";')
assert.ok(directive('components/button/Button.js'), 'Interactive components are client modules')
assert.ok(!directive('components/text/Text.js'), 'Static components stay server components')
assert.ok(!directive('index.js'), 'The entry re-exports without a client boundary')
for (const entry of Object.values(manifest.exports)) {
  for (const path of typeof entry === 'string' ? [entry] : Object.values(entry)) {
    assert.ok(existsSync(resolve(root, path)), `Missing package export ${path}`)
  }
}
assert.ok(
  readFileSync(
    fileURLToPath(import.meta.resolve('@hina-ui/react/styles/tokens.css')),
    'utf8',
  ).includes('@source'),
)
for (const name of ['Button', 'Card', 'ScrollArea', 'Stack', 'Text', 'Tooltip', 'TooltipProvider'])
  assert.ok(ui[name], `Missing public export ${name}`)
const html = renderToString(
  h(
    'main',
    null,
    h(ui.Button, { loading: true }, 'Save'),
    h(ui.ScrollArea, { focusable: true }, h(ui.Text, null, 'Packed content')),
    h(ui.TooltipProvider, null, h(ui.Tooltip, { content: 'Hint' }, h('button', null, 'Hover'))),
  ),
)
assert.match(html, /<button/)
assert.match(html, /aria-busy="true"/)
assert.match(html, /Packed content/)
assert.match(html, /data-overlayscrollbars-initialize/)
console.log(`ESM exports (${Object.keys(ui).length}), CSS entry and Node SSR passed.`)
