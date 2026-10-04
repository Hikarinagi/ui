import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import test from 'node:test'

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

test('the Nuxt pipeline renders vue blocks and drops react blocks', async () => {
  const { markdown } = await import('./markdown.ts')
  const plugin = markdown() as unknown as {
    transform: (this: unknown, raw: string, id: string) => Promise<{ code: string } | string>
  }
  const render = async (source: string) => {
    const result = await plugin.transform.call(
      {
        error(error: unknown) {
          throw error
        },
      },
      source,
      '/docs/content/en/framework-fixture.md',
    )
    return typeof result === 'string' ? result : result.code
  }
  const rendered = await render(blocks)
  assert.equal(rendered, await render(vue))
  assert.match(rendered, /Vue setup/)
  assert.match(rendered, /Built for Vue\./)
  assert.doesNotMatch(rendered, /React/)
})
