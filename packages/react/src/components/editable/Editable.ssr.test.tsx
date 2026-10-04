import { expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { Editable } from './Editable'

it.each([
  [false, false],
  [false, true],
  [true, false],
  [true, true],
])(
  'renders escaped text and committed form value with editing=%s and multiline=%s',
  (editing, multiline) => {
    const html = renderToString(
      <Editable
        value="<Project>"
        name="title"
        editing={editing}
        multiline={multiline}
        aria-label="Title"
      />,
    )
    expect(html).toContain(editing ? 'data-state="editing"' : 'data-state="preview"')
    expect(html).toContain('name="title" value="&lt;Project&gt;"')
    expect(html).not.toContain('<Project>')
    expect(html).not.toContain('role="alert"')
  },
)

it('renders read-only text without an edit button', () => {
  const html = renderToString(<Editable value="Title" readonly />)
  expect(html).toContain('Title')
  expect(html).not.toContain('<button')
})
