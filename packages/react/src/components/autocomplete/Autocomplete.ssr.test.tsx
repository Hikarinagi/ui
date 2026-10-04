import { expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { Autocomplete } from './Autocomplete'

it.each([false, true])(
  'renders free text and stable combobox semantics with open=%s',
  async open => {
    const html = renderToString(
      <Autocomplete
        value="entry:http sta"
        options={[{ value: 'status', label: 'status:' }]}
        open={open}
        aria-label="Query"
      />,
    )
    expect(html).toContain('value="entry:http sta"')
    expect(html).toContain('role="combobox"')
    expect(html).not.toContain('aria-activedescendant=')
    expect(html).not.toContain('role="option"')
  },
)
