import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { FormLayout } from './FormLayout'
import { FormField } from '../form-field/FormField'
import { Input } from '../input/Input'
import '../../../test/browser.css'

function attach(width: number) {
  const host = document.createElement('div')
  host.style.cssText = `width: ${width}px; padding: 40px`
  document.body.appendChild(host)
  return host
}

function field(name: string) {
  return (
    <FormField key={name} name={name} label={name}>
      <Input />
    </FormField>
  )
}

describe('FormLayout', () => {
  it('两列栅格里字段并排，legend 在栅格之上', async () => {
    await page.viewport(1024, 768)
    const host = attach(720)
    await render(
      <FormLayout legend="联系方式" columns={2}>
        {field('email')}
        {field('phone')}
      </FormLayout>,
      { container: host },
    )
    const grid = host.querySelector('fieldset > div') as HTMLElement
    expect(getComputedStyle(grid).gridTemplateColumns.split(' ')).toHaveLength(2)
    const [first, second] = [...host.querySelectorAll('[data-hn-form-field]')].map(f =>
      f.getBoundingClientRect(),
    )
    expect(first!.top).toBe(second!.top)
    expect(second!.left).toBeGreaterThan(first!.right)
    const legend = host.querySelector('legend')!.getBoundingClientRect()
    expect(legend.bottom).toBeLessThanOrEqual(first!.top)
  })
})
