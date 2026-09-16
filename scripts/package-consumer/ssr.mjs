import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import * as ui from '@hina-ui/vue'

assert.equal(typeof window, 'undefined')
assert.equal(typeof document, 'undefined')
const manifestURL = import.meta.resolve('@hina-ui/vue/package.json')
const manifest = JSON.parse(readFileSync(fileURLToPath(manifestURL), 'utf8'))
const root = dirname(fileURLToPath(manifestURL))
assert.ok(
  import.meta.resolve('@hina-ui/vue').startsWith(new URL('./node_modules/', import.meta.url).href),
)
for (const entry of Object.values(manifest.exports)) {
  for (const path of typeof entry === 'string' ? [entry] : Object.values(entry)) {
    assert.ok(existsSync(resolve(root, path)), `Missing package export ${path}`)
  }
}
assert.ok(
  readFileSync(
    fileURLToPath(import.meta.resolve('@hina-ui/vue/styles/tokens.css')),
    'utf8',
  ).includes('@source'),
)
for (const name of [
  'Button',
  'DataTable',
  'Form',
  'Combobox',
  'MultiCombobox',
  'Dialog',
  'Sheet',
  'Drawer',
  'Popover',
  'HoverCard',
  'Lightbox',
  'Tree',
]) {
  assert.ok(ui[name], `Missing public export ${name}`)
}
const html = await renderToString(
  createSSRApp({
    render: () =>
      h('main', [
        h(ui.Button, {}, () => 'Save'),
        h(ui.DataTable, {
          rows: [{ id: 1, name: 'Packed row' }],
          columns: [{ key: 'name', label: 'Name' }],
          rowKey: 'id',
          caption: 'Packed table',
        }),
        h(ui.Combobox, {
          options: [],
          modelValue: 7,
          selectedOption: { value: 7, label: 'Saved name' },
          loading: true,
        }),
        h(ui.MultiCombobox, {
          options: [],
          modelValue: [7],
          selectedOptions: [{ value: 7, label: 'Saved name' }],
        }),
        h(ui.Lightbox, { items: [], open: false }),
      ]),
  }),
)
assert.match(html, /<button/)
assert.match(html, /<table/)
assert.match(html, /Packed row/)
assert.match(html, /Saved name/)
assert.match(html, /aria-busy="true"/)
console.log(`ESM exports (${Object.keys(ui).length}), CSS entry and Node SSR passed.`)
