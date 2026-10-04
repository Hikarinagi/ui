import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { InputGroup } from './InputGroup'
import { InputGroupAddon } from './InputGroupAddon'
import { Input } from '../input/Input'
import { NumberInput } from '../number-input/NumberInput'
import { Button } from '../button/Button'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

function mount(ui: ReactNode) {
  const element = render(ui).container.firstElementChild as HTMLElement
  return { element, classes: () => [...element.classList] }
}

describe('一副输入面', () => {
  it('组根就是 hn-field 宿主，边框、阴影与档位落在组上；组内输入框退壳', () => {
    const w = mount(
      <InputGroup>
        <InputGroupAddon>https://</InputGroupAddon>
        <Input aria-label="域名" />
        <Button>确定</Button>
      </InputGroup>,
    )
    expect(w.element.getAttribute('data-hn-input-group')).toBe('')
    expect(w.classes()).toContain('hn-field')
    expect(w.classes()).toContain('[--hn-field-shadow:var(--hn-shadow-sm)]')
    expect(w.classes().join(' ')).toContain('control-h-md')
    const field = w.element.querySelector('[data-hn-input]')!
    expect(field.classList).not.toContain('hn-field')
    expect(field.classList).toContain('flex-1')
    expect(w.classes()).toContain('[&>*+*]:border-s')
    expect(w.classes()).toContain('[&>button]:rounded-none')
  })

  it('尺寸与形态设置在组上，组内输入框的附属件按组的档位取尺寸', () => {
    const w = mount(
      <InputGroup size="lg" variant="secondary">
        <Input aria-label="关键词" clearable value="星见" />
      </InputGroup>,
    )
    expect(w.classes().join(' ')).toContain('control-h-lg')
    expect(w.classes()).toContain('border-transparent')
    expect(w.classes().join(' ')).toContain('--hn-input-icon:1.125rem')
    expect(w.element.querySelector('[data-hn-input] button')!.className).toContain(
      'var(--hn-input-icon)',
    )
  })

  it('disabled 与 invalid 下发到组内的每个输入框', () => {
    const w = mount(
      <InputGroup disabled invalid>
        <Input aria-label="域名" />
        <NumberInput aria-label="数量" />
      </InputGroup>,
    )
    expect(w.element.getAttribute('data-invalid')).toBe('')
    const inputs = [...w.element.querySelectorAll('input')]
    expect(inputs).toHaveLength(2)
    expect(inputs.every(i => i.disabled)).toBe(true)
    expect(inputs.every(i => i.getAttribute('aria-invalid') === 'true')).toBe(true)
    expect(w.element.querySelector('[data-hn-number-input]')!.classList).not.toContain('hn-field')
  })

  it('附属段不带自己的底色，只靠分隔线与 muted 字区分', () => {
    const addon = mount(<InputGroupAddon>kg</InputGroupAddon>)
    expect(addon.classes()).toContain('text-muted')
    expect(addon.classes().join(' ')).not.toContain('bg-')
    expect(addon.classes().join(' ')).not.toContain('border')
  })

  it('无 a11y 违规', async () => {
    const w = mount(
      <InputGroup>
        <InputGroupAddon>https://</InputGroupAddon>
        <Input aria-label="域名" />
        <Button>确定</Button>
      </InputGroup>,
    )
    await expectNoA11yViolations(w.element)
  })
})
