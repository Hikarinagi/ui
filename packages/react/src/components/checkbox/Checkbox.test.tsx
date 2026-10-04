import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { useState, type ReactNode } from 'react'
import { Checkbox, type CheckboxProps } from './Checkbox'
import type { CheckedState } from '../../primitives/checkbox'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

function mount(ui: ReactNode) {
  const element = render(ui).container.firstElementChild as HTMLElement
  return {
    element,
    classes: () => [...element.classList],
    find: (selector: string) => element.querySelector(selector) as HTMLElement,
    findAll: (selector: string) => [...element.querySelectorAll<HTMLElement>(selector)],
  }
}

const emitted = (fn: Mock) => (fn.mock.calls.length ? fn.mock.calls : undefined)

function mountModel(props: CheckboxProps) {
  const onModel = vi.fn()
  function Harness() {
    const [value, setValue] = useState<CheckedState | undefined>(props.checked)
    return (
      <Checkbox
        {...props}
        checked={value}
        onCheckedChange={next => {
          onModel(next)
          setValue(next)
        }}
      />
    )
  }
  return { ...mount(<Harness />), onModel }
}

describe('结构', () => {
  it('根是 label，盒是 role=checkbox 的按钮，文字与描述在盒之后；attrs 落在盒上，class 落在根上', () => {
    const w = mount(
      <Checkbox description="每周一封" className="w-64" id="letter" data-x="1">
        订阅周报
      </Checkbox>,
    )
    expect(w.element.tagName).toBe('LABEL')
    expect(w.element.getAttribute('data-hn-checkbox')).toBe('')
    expect(w.element.getAttribute('data-hn-state-group')).toBe('')
    expect(w.classes()).toContain('w-64')
    const box = w.find('[role="checkbox"]')
    expect(box.tagName).toBe('BUTTON')
    expect(box.getAttribute('type')).toBe('button')
    expect(box.getAttribute('id')).toBe('letter')
    expect(box.getAttribute('data-x')).toBe('1')
    expect(box.getAttribute('aria-checked')).toBe('false')
    expect(box.getAttribute('data-state')).toBe('unchecked')
    expect(box.querySelector('svg')).toBeNull()
    expect(w.element.textContent).toContain('订阅周报')
    expect(w.element.textContent).toContain('每周一封')
    expect(w.find('.text-muted').textContent).toBe('每周一封')
  })

  it('无文字时只有盒，名称经 aria-label 落在盒上', () => {
    const w = mount(<Checkbox aria-label="全选" />)
    expect(w.find('[role="checkbox"]').getAttribute('aria-label')).toBe('全选')
    expect(w.findAll(':scope > span')).toHaveLength(0)
  })

  it('选中与半选：aria-checked 与 data-state 随值变化，盒内的图标只在有值时存在', () => {
    const checked = mount(<Checkbox checked />)
    const box = checked.find('[role="checkbox"]')
    expect(box.getAttribute('aria-checked')).toBe('true')
    expect(box.getAttribute('data-state')).toBe('checked')
    expect(box.querySelector('svg.lucide-check')).not.toBeNull()
    const mixed = mount(<Checkbox checked="indeterminate" />)
    const mixedBox = mixed.find('[role="checkbox"]')
    expect(mixedBox.getAttribute('aria-checked')).toBe('mixed')
    expect(mixedBox.getAttribute('data-state')).toBe('indeterminate')
    expect(mixedBox.querySelector('svg.lucide-minus')).not.toBeNull()
    expect(mixedBox.querySelector('svg.lucide-check')).toBeNull()
  })

  it('三档尺寸落在根上的字号与尺寸变量，描述随档位小一号', () => {
    const sm = mount(<Checkbox size="sm" description="d" />)
    expect(sm.classes()).toContain('text-sm')
    expect([...sm.find('[role="checkbox"]').classList]).toContain('[--hn-checkbox-size:0.875rem]')
    expect([...sm.find('.text-muted').classList]).toContain('text-xs')
    const lg = mount(<Checkbox size="lg" description="d" />)
    expect(lg.classes()).toContain('text-md')
    expect([...lg.find('[role="checkbox"]').classList]).toContain('[--hn-checkbox-size:1.125rem]')
    expect([...lg.find('.text-muted').classList]).toContain('text-base')
  })

  it('disabled 落在根与盒上；invalid 只落在盒上', () => {
    const disabled = mount(<Checkbox disabled />)
    expect(disabled.element.getAttribute('data-disabled')).toBe('')
    const box = disabled.find('[role="checkbox"]')
    expect(box.getAttribute('disabled')).not.toBeNull()
    expect(box.getAttribute('data-disabled')).toBe('')
    const invalid = mount(<Checkbox invalid />)
    expect(invalid.element.getAttribute('data-invalid')).toBeNull()
    const invalidBox = invalid.find('[role="checkbox"]')
    expect(invalidBox.getAttribute('data-invalid')).toBe('')
    expect(invalidBox.getAttribute('aria-invalid')).toBe('true')
  })
})

describe('交互', () => {
  it('点击盒切换值；半选点一下变为选中；禁用时不响应', () => {
    const w = mountModel({ checked: false })
    fireEvent.click(w.find('[role="checkbox"]'))
    expect(emitted(w.onModel)?.[0]).toEqual([true])
    fireEvent.click(w.find('[role="checkbox"]'))
    expect(emitted(w.onModel)?.[1]).toEqual([false])

    const onMixed = vi.fn()
    const mixed = mount(<Checkbox checked="indeterminate" onCheckedChange={onMixed} />)
    fireEvent.click(mixed.find('[role="checkbox"]'))
    expect(emitted(onMixed)?.[0]).toEqual([true])

    const onDisabled = vi.fn()
    const disabled = mount(<Checkbox disabled onCheckedChange={onDisabled} />)
    fireEvent.click(disabled.find('[role="checkbox"]'))
    expect(emitted(onDisabled)).toBeUndefined()
  })
})

describe('无障碍', () => {
  it('有文字、有描述、仅 aria-label 三种形态均无违规', async () => {
    const labelled = mount(
      <Checkbox checked description="每周一封">
        订阅周报
      </Checkbox>,
    )
    await expectNoA11yViolations(labelled.element)
    const bare = mount(<Checkbox aria-label="全选" />)
    await expectNoA11yViolations(bare.element)
  })
})
