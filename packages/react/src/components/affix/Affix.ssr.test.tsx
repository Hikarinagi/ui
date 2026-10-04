import { expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { Affix } from './Affix'

it.each(['top', 'bottom'] as const)(
  'renders %s positioning and content before hydration',
  async position => {
    const html = renderToString(
      <Affix as="aside" position={position} offset={16} aria-label="Actions">
        {({ affixed }) => <button>{`Save ${affixed}`}</button>}
      </Affix>,
    )
    expect(html).toContain('<aside')
    expect(html).toContain('sticky')
    expect(html).toContain(`data-position="${position}"`)
    expect(html).toContain('--hn-affix-offset:16px')
    expect(html).toContain('aria-label="Actions"')
    expect(html).toContain('Save false')
    expect(html).not.toContain('data-affixed')
  },
)

it('renders disabled content in normal flow and sanitizes non-finite offsets', async () => {
  const html = renderToString(
    <Affix disabled offset={Infinity}>
      Content
    </Affix>,
  )
  expect(html).not.toContain('sticky')
  expect(html).toContain('data-disabled')
  expect(html).toContain('--hn-affix-offset:0px')
  expect(html).toContain('Content')
})
