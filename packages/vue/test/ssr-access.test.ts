import { describe, expect, it } from 'vitest'
import { topLevelBrowserAccess } from './ssr-access'

describe('SSR top-level access constraint', () => {
  it.each([
    'const root = document.body',
    'const root =\n document.body',
    'const viewport = window["innerWidth"]',
    'const root = document',
    'export const root = (() => document.body)()',
    'class A { static root = document.body }',
    'window.addEventListener("resize", () => {})',
  ])('detects eagerly evaluated access: %s', source => {
    expect(topLevelBrowserAccess(source).length).toBeGreaterThan(0)
  })

  it.each([
    'export function download() { if (typeof document === "undefined") return; const a = document.createElement("a") }',
    'const callback = () => { const width = window.innerWidth }',
    'onMounted(() => { const root = document.body })',
    'function resize(handle) { const document = handle.ownerDocument; const window = document.defaultView; const width = window.innerWidth }',
    'const document = { body: null }; const root = document.body',
    '{ const window = { innerWidth: 100 }; const width = window.innerWidth }',
    'const hasDOM = typeof window !== "undefined"',
    'const source = "const root = document.body"',
    'interface A { window: typeof window }',
    'class A { root = document.body; resize() { return window.innerWidth } }',
  ])('does not mistake deferred code or local bindings for global access: %s', source => {
    expect(topLevelBrowserAccess(source)).toEqual([])
  })

  it('checks both SFC scripts and excludes templates and styles', () => {
    const source =
      '<script lang="ts">const a = document.body</script>' +
      '<script setup lang="ts">const b = window.innerWidth; const read = () => document.body</script>' +
      '<template><p>window.innerWidth</p></template>'
    expect(topLevelBrowserAccess(source, true)).toEqual(['document.body', 'window.innerWidth'])
  })
})
