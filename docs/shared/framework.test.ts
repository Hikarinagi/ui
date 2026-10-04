import assert from 'node:assert/strict'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { registerHooks } from 'node:module'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { frameworkView } from './framework.ts'

registerHooks({
  resolve(specifier, context, next) {
    try {
      return next(specifier, context)
    } catch (error) {
      if (!specifier.startsWith('.')) throw error
      return next(`${specifier}.ts`, context)
    }
  },
})

const blocks = `---
title: Install
::: vue
description: Built for Vue.
:::
::: react
description: Built for React.
:::
---

Shared intro.

::: vue
## Vue setup {#setup}

\`\`\`vue
<Button />
\`\`\`
:::

::: react
## React setup {#setup}

\`\`\`tsx
<Button />
\`\`\`
:::

Shared middle.

::: react
React-only note.
:::

Shared end.
`

const vue = `---
title: Install
description: Built for Vue.
---

Shared intro.

## Vue setup {#setup}

\`\`\`vue
<Button />
\`\`\`

Shared middle.

Shared end.
`

const react = `---
title: Install
description: Built for React.
---

Shared intro.

## React setup {#setup}

\`\`\`tsx
<Button />
\`\`\`

Shared middle.

React-only note.

Shared end.
`

test('each framework keeps its own blocks unwrapped and drops the other', () => {
  assert.equal(frameworkView(blocks, 'vue'), vue)
  assert.equal(frameworkView(blocks, 'react'), react)
  assert.equal(frameworkView(vue, 'vue'), vue)
})

test('a block between paragraphs without blank lines keeps them apart', () => {
  assert.equal(frameworkView('A\n::: react\nB\n:::\n\nC\n', 'vue'), 'A\n\nC\n')
  assert.equal(frameworkView('A\n\n::: react\nB\n:::\n', 'vue'), 'A\n')
  assert.equal(frameworkView('::: react\nB\n:::\n\nC\n', 'vue'), 'C\n')
})

test('blank lines just inside a block belong to the block', () => {
  const padded = 'A\n\n::: vue\n\nB\n\n:::\n\n::: react\n\n| a |\n| - |\n| 1 |\n\n:::\n\nC\n'
  assert.equal(frameworkView(padded, 'vue'), 'A\n\nB\n\nC\n')
  assert.equal(frameworkView(padded, 'react'), 'A\n\n| a |\n| - |\n| 1 |\n\nC\n')
})

test('markers inside code fences are content', () => {
  const fenced = '```md\n::: vue\nx\n:::\n```\n'
  assert.equal(frameworkView(fenced, 'react'), fenced)
  const nested = '::: react\n````md\n:::\n````\n:::\n'
  assert.equal(frameworkView(nested, 'react'), '````md\n:::\n````\n')
  assert.equal(frameworkView(nested, 'vue'), '')
})

test('unbalanced blocks are rejected', () => {
  assert.throws(() => frameworkView('::: vue\nx\n', 'vue'), /never closed/)
  assert.throws(() => frameworkView('::: vue\n::: react\n:::\n:::\n', 'vue'), /opens inside/)
})

test('the Vue search index ignores headings in react blocks', async () => {
  const { pagesOf } = await import('./search-index.ts')
  const root = await mkdtemp(join(tmpdir(), 'hina-framework-'))
  try {
    await mkdir(join(root, 'en'))
    await writeFile(join(root, 'en', 'install.md'), blocks)
    const [vuePage] = await pagesOf('en', root)
    assert.equal(vuePage?.description, 'Built for Vue.')
    assert.deepEqual(
      vuePage?.headings.map(heading => heading.label),
      ['Vue setup'],
    )
    const [reactPage] = await pagesOf('en', root, source => frameworkView(source, 'react'))
    assert.deepEqual(
      reactPage?.headings.map(heading => heading.label),
      ['React setup'],
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
