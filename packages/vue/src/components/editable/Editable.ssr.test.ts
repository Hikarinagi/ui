import { expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Editable from './Editable.vue'

it.each([
  [false, false],
  [false, true],
  [true, false],
  [true, true],
])(
  'renders escaped text and committed form value with editing=%s and multiline=%s',
  async (editing, multiline) => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(Editable, {
            modelValue: '<Project>',
            name: 'title',
            editing,
            multiline,
            'aria-label': 'Title',
          }),
      }),
    )
    expect(html).toContain(editing ? 'data-state="editing"' : 'data-state="preview"')
    expect(html).toContain('name="title" value="&lt;Project&gt;"')
    expect(html).not.toContain('<Project>')
    expect(html).not.toContain('role="alert"')
  },
)

it('renders read-only text without an edit button', async () => {
  const html = await renderToString(
    createSSRApp({ render: () => h(Editable, { modelValue: 'Title', readonly: true }) }),
  )
  expect(html).toContain('Title')
  expect(html).not.toContain('<button')
})
