import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'

const locale = JSON.parse(
  readFileSync(fileURLToPath(new URL('./i18n/locales/zh-CN.json', import.meta.url)), 'utf8'),
)

test('Chinese documentation sidebar gives every component a short name', () => {
  assert.deepEqual(
    Object.keys(locale.components).filter(key => !locale.names[key]),
    [],
  )
})
