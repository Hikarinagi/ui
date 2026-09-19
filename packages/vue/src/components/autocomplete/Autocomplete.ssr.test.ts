import { expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Autocomplete from './Autocomplete.vue'

it.each([false, true])(
  'renders free text and stable combobox semantics with open=%s',
  async open => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(Autocomplete, {
            modelValue: 'entry:http sta',
            options: [{ value: 'status', label: 'status:' }],
            open,
            'aria-label': 'Query',
          }),
      }),
    )
    expect(html).toContain('value="entry:http sta"')
    expect(html).toContain('role="combobox"')
    expect(html).not.toContain('aria-activedescendant=')
    expect(html).not.toContain('role="option"')
  },
)
