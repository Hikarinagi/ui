import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { FormLayout } from './FormLayout'
import { Form } from '../form/Form'
import type { FormErrors, FormValidator } from '../form/standard-schema'
import { FormField } from '../form-field/FormField'
import { Input } from '../input/Input'
import { expectNoA11yViolations } from '../../../test/axe'

const reactEnvironment = globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }

afterEach(() => {
  cleanup()
  reactEnvironment.IS_REACT_ACT_ENVIRONMENT = true
})

function field(name: string) {
  return (
    <FormField name={name} label={name}>
      <Input />
    </FormField>
  )
}

describe('FormLayout', () => {
  it('渲染 fieldset 与 legend，说明文字关联到 fieldset', async () => {
    const { container } = render(
      <FormLayout legend="联系方式" description="用于接收通知">
        {field('email')}
        {field('phone')}
      </FormLayout>,
    )
    const fieldset = container.querySelector('fieldset')!
    expect(fieldset).not.toBeNull()
    expect(container.querySelector('legend')!.textContent).toBe('联系方式')
    const description = container.querySelector('p')!
    expect(description.textContent).toBe('用于接收通知')
    expect(fieldset.getAttribute('aria-describedby')).toBe(description.getAttribute('id'))
    await expectNoA11yViolations(container.firstElementChild!)
  })

  it('没有标题时不渲染 legend，栅格不留顶部间距', () => {
    const { container } = render(<FormLayout>{field('email')}</FormLayout>)
    expect(container.querySelector('legend')).toBeNull()
    expect(container.querySelector('fieldset > div')!.classList).not.toContain('mt-4')
  })

  it('columns 决定栅格列数，窄屏收成一列', () => {
    const { container } = render(<FormLayout columns={2}>{field('email')}</FormLayout>)
    const grid = container.querySelector('fieldset > div')!
    expect(grid.classList).toContain('grid-cols-1')
    expect(grid.classList).toContain('sm:grid-cols-2')
  })

  it('disabled 禁用 fieldset 与其中的字段', () => {
    const { container } = render(<FormLayout disabled>{field('email')}</FormLayout>)
    expect(container.querySelector('fieldset')!.getAttribute('disabled')).not.toBeNull()
    expect(container.querySelector('input')!.getAttribute('disabled')).not.toBeNull()
    expect(container.querySelector('[data-hn-form-field]')!.getAttribute('data-disabled')).toBe('')
  })

  it('放在 Form 里时字段仍能取得错误，表单禁用时整组禁用', async () => {
    reactEnvironment.IS_REACT_ACT_ENVIRONMENT = false
    const values = { email: '' }
    const rules: FormValidator = () => {
      const errors: FormErrors = {}
      if (!values.email) errors.email = '请输入邮箱'
      return errors
    }
    const ui = (disabled?: boolean) => (
      <Form values={values} rules={rules} disabled={disabled}>
        <FormLayout legend="联系方式">{field('email')}</FormLayout>
      </Form>
    )
    const { container, rerender } = render(ui())
    fireEvent.submit(container.querySelector('form')!)
    await vi.waitFor(() =>
      expect(container.querySelector('[data-hn-form-field] p[aria-live]')!.textContent).toBe(
        '请输入邮箱',
      ),
    )
    rerender(ui(true))
    expect(container.querySelector('fieldset')!.getAttribute('disabled')).not.toBeNull()
    expect(container.querySelector('input')!.getAttribute('disabled')).not.toBeNull()
  })
})
