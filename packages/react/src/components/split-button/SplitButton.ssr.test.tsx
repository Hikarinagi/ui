import { expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { SplitButton } from './SplitButton'
import { DropdownMenuItem } from '../dropdown-menu/DropdownMenuItem'

it.each([false, true])('renders usable controls without a browser when open=%s', async open => {
  const html = renderToString(
    <SplitButton
      open={open}
      type="submit"
      name="intent"
      value="save"
      menuLabel="Save options"
      renderContent={() => <DropdownMenuItem>Publish</DropdownMenuItem>}
    >
      {'Save <draft>'}
    </SplitButton>,
  )
  expect(html).toContain('Save &lt;draft&gt;')
  expect(html).toContain('name="intent"')
  expect(html).toContain('type="submit"')
  expect(html).toContain('type="button"')
  expect(html).toContain('aria-label="Save options"')
  expect(html.match(/<button /g)).toHaveLength(2)
})

it('renders a link and disables both controls while loading', async () => {
  const html = renderToString(
    <SplitButton as="a" href="/document" loading renderContent={() => []}>
      Open
    </SplitButton>,
  )
  expect(html).toContain('href="/document"')
  expect(html).toContain('aria-busy="true"')
  expect(html).toContain('aria-disabled="true"')
  expect(html).toContain(' disabled')
})
