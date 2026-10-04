import { expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { Stepper } from './Stepper'

it('renders steps, descriptions and current-state semantics without a browser', async () => {
  const html = renderToString(
    <Stepper
      items={[{ title: 'First' }, { title: 'Second', description: 'Details' }]}
      defaultValue={2}
      dir="rtl"
    />,
  )
  expect(html).toContain('aria-current="step"')
  expect(html).toContain('dir="rtl"')
  expect(html).toContain('Details')
  expect(html).toContain('第 2 步，共 2 步')
  expect(html).not.toContain('aria-controls=')
})
