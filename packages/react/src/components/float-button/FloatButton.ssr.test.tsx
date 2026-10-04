import { expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { TooltipProvider } from '../tooltip/TooltipProvider'
import { FloatButton } from './FloatButton'

it.each([false, true])(
  'renders accessible button content before hydration, provider=%s',
  async provider => {
    const button = (
      <FloatButton label="Create <project>" position="absolute" extended>
        <svg aria-hidden="true" />
      </FloatButton>
    )
    const html = renderToString(provider ? <TooltipProvider>{button}</TooltipProvider> : button)
    expect(html).toContain('<button')
    expect(html).toContain('aria-label="Create &lt;project&gt;"')
    expect(html).toContain('data-position="absolute"')
    expect(html).not.toContain('role="tooltip"')
  },
)

it('renders no focusable action when hidden', async () => {
  const html = renderToString(
    <FloatButton label="Create" visible={false}>
      +
    </FloatButton>,
  )
  expect(html).not.toContain('<button')
})
