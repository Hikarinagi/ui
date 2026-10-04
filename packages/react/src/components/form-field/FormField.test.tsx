import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { FormField, type FormFieldProps } from './FormField'
import { Input } from '../input/Input'
import { RadioGroup } from '../radio-group/RadioGroup'
import { CheckboxGroup } from '../checkbox-group/CheckboxGroup'

afterEach(cleanup)

function build(props: Partial<FormFieldProps> = {}, control: ReactNode = <Input />) {
  const element = render(<FormField {...props}>{control}</FormField>).container
    .firstElementChild as HTMLElement
  return {
    element,
    find: (selector: string) => element.querySelector(selector) as HTMLElement,
  }
}

describe('FormField', () => {
  it('标签通过 for 指向控件', () => {
    const w = build({ label: '名称' })
    const label = w.find('label')
    const input = w.find('input')
    expect(input.getAttribute('id')).toBeTruthy()
    expect(label.getAttribute('for')).toBe(input.getAttribute('id'))
  })

  it('控件自带的 id 优先', () => {
    const w = build({ label: '名称' }, <Input id="custom" />)
    expect(w.find('input').getAttribute('id')).toBe('custom')
    expect(w.find('label').getAttribute('for')).toBe('custom')
  })

  it('必填时显示标记并给读屏器提供文字', () => {
    const w = build({ label: '名称', required: true })
    expect(w.find('label [aria-hidden="true"]').textContent).toBe('*')
    expect(w.find('label').textContent).toContain('必填')
  })

  it('说明文字通过 aria-describedby 关联到控件', () => {
    const w = build({ label: '名称', description: '公开显示' })
    const description = w.find('p')
    expect(description.textContent).toBe('公开显示')
    expect(w.find('input').getAttribute('aria-describedby')).toBe(description.getAttribute('id'))
  })

  it('error 直接显示错误并把控件标为无效', () => {
    const w = build({ label: '名称', error: '不能为空' })
    const message = w.find('p[aria-live]')
    expect(message.textContent).toBe('不能为空')
    expect(w.element.getAttribute('data-invalid')).toBe('')
    const input = w.find('input')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.getAttribute('aria-describedby')).toBe(message.getAttribute('id'))
  })

  it('disabled 传递给控件', () => {
    const w = build({ label: '名称', disabled: true })
    expect(w.find('input').getAttribute('disabled')).not.toBeNull()
    expect(w.element.getAttribute('data-disabled')).toBe('')
  })

  it('成组控件通过 aria-labelledby 关联标签', () => {
    const w = build(
      { label: '类型', error: '请选择' },
      <RadioGroup options={[{ label: '甲', value: 'a' }]} />,
    )
    const root = w.find('[data-hn-radio-group]')
    expect(root.getAttribute('aria-labelledby')).toBe(w.find('label').getAttribute('id'))
    expect(root.getAttribute('aria-invalid')).toBe('true')
  })

  it('复选框组内的复选框不会重复领取字段 id', () => {
    const w = build(
      { label: '标签' },
      <CheckboxGroup
        options={[
          { label: '甲', value: 'a' },
          { label: '乙', value: 'b' },
        ]}
      />,
    )
    const ids = [...w.element.querySelectorAll('button')].map(
      button => button.getAttribute('id') ?? undefined,
    )
    expect(ids.every(id => id === undefined)).toBe(true)
  })
})
