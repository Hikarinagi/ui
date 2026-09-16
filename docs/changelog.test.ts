import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { expandChangelog, renderChangelog } from './changelog.ts'

const source = `# @hina-ui/vue

## [1.7.1](https://github.com/Hikarinagi/ui/compare/old...new) (2026-09-16)

### Fixed

- **Form** Discard stale results. Keep \`reset()\` available.

## 1.7.0

### Minor Changes

- 1a8ce61: Add a trailing slot.
`

test('current and historical releases receive stable version anchors and preserve their notes', () => {
  const rendered = renderChangelog(source)
  assert.match(rendered, /^## 1\.7\.1 \{#v1-7-1\}/)
  assert.match(
    rendered,
    /2026-09-16 · \[Release\]\(https:\/\/github.com\/Hikarinagi\/ui\/releases\/tag\/%40hina-ui%2Fvue%401.7.1\)/,
  )
  assert.match(
    rendered,
    /\[Compare\]\(https:\/\/github.com\/Hikarinagi\/ui\/compare\/old\.\.\.new\)/,
  )
  assert.match(
    rendered,
    /### Fixed\n\n- \*\*Form\*\* Discard stale results\. Keep `reset\(\)` available\./,
  )
  assert.match(rendered, /## 1\.7\.0 \{#v1-7-0\}/)
  assert.match(rendered, /### Minor Changes/)
  assert.match(
    rendered,
    /\[1a8ce61\]\(https:\/\/github.com\/Hikarinagi\/ui\/commit\/1a8ce61\): Add a trailing slot\./,
  )
  assert.equal((rendered.match(/^## /gm) ?? []).length, 2)
  assert.equal((rendered.match(/2026-09-16/g) ?? []).length, 1)
})

test('content expansion preserves localized metadata and leaves other documents untouched', () => {
  const page = '---\ntitle: 变更记录\n---\n\n<Changelog />\n'
  assert.equal(
    expandChangelog(page, source),
    page.replace('<Changelog />', renderChangelog(source)),
  )
  assert.equal(
    expandChangelog('## Color\n\nUse semantic tokens.', source),
    '## Color\n\nUse semantic tokens.',
  )
  assert.ok(
    expandChangelog('<Changelog />', '# Package\n\n## 2.0.0\n\n- Keep $& literal.').includes(
      'Keep $& literal.',
    ),
  )
})

test('the package changelog exposes every released version without duplicate anchors', async () => {
  const raw = await readFile(new URL('../packages/vue/CHANGELOG.md', import.meta.url), 'utf8')
  const rendered = renderChangelog(raw)
  const headings = [...rendered.matchAll(/^## (.+) \{#([^}]+)\}$/gm)]
  assert.equal(headings.length, (raw.match(/^## /gm) ?? []).length)
  assert.equal(new Set(headings.map(heading => heading[2])).size, headings.length)
  assert.doesNotMatch(rendered, /<Changelog \/>/)
})
