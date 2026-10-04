import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Chip } from './Chip'
import { resetDevWarnings } from '../../lib/dev'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
  resetDevWarnings()
})

afterEach(cleanup)

function mount(ui: ReactNode) {
  const screen = render(ui)
  return { ...screen, element: screen.container.firstElementChild as HTMLElement }
}

const label = '科幻'

describe('结构与语义', () => {
  it('默认渲染 span，没有按钮也没有切换语义', () => {
    const w = mount(<Chip>{label}</Chip>)
    expect(w.element.tagName).toBe('SPAN')
    expect(w.element.querySelector('button')).toBeNull()
    expect(w.element.getAttribute('aria-pressed')).toBeNull()
    expect(w.element.textContent).toBe('科幻')
  })

  it('selectable 渲染 button，aria-pressed 跟随 selected，点击回写', () => {
    const onUpdate = vi.fn()
    const w = mount(
      <Chip selectable selected={false} onSelectedChange={onUpdate}>
        {label}
      </Chip>,
    )
    expect(w.element.tagName).toBe('BUTTON')
    expect(w.element.getAttribute('type')).toBe('button')
    expect(w.element.getAttribute('aria-pressed')).toBe('false')
    expect(w.element.getAttribute('data-state')).toBeNull()
    expect(w.element.querySelector('svg')).toBeNull()

    fireEvent.click(w.element)
    expect(onUpdate).toHaveBeenCalledWith(true)

    w.rerender(
      <Chip selectable selected={true} onSelectedChange={onUpdate}>
        {label}
      </Chip>,
    )
    expect(w.element.getAttribute('aria-pressed')).toBe('true')
    expect(w.element.getAttribute('data-state')).toBe('selected')
    expect(w.element.querySelector('svg')).not.toBeNull()
  })

  it('removable 的根仍是 span，移除按钮点击与退格、删除键都触发 remove', () => {
    const onRemove = vi.fn()
    const onSelectedChange = vi.fn()
    const w = mount(
      <Chip removable onRemove={onRemove} onSelectedChange={onSelectedChange}>
        {label}
      </Chip>,
    )
    expect(w.element.tagName).toBe('SPAN')
    const remove = w.element.querySelector('button')!
    expect(remove.getAttribute('type')).toBe('button')
    expect(remove.getAttribute('aria-label')).toBe('移除')

    fireEvent.click(remove)
    fireEvent.keyDown(remove, { key: 'Backspace' })
    fireEvent.keyDown(remove, { key: 'Delete' })
    fireEvent.keyDown(remove, { key: 'a' })
    expect(onRemove).toHaveBeenCalledTimes(3)
    expect(onSelectedChange).not.toHaveBeenCalled()
  })

  it('disabled 的可选中条目不切换，可移除条目的按钮禁用', () => {
    const onUpdate = vi.fn()
    const w = mount(
      <Chip selectable disabled onSelectedChange={onUpdate}>
        {label}
      </Chip>,
    )
    expect(w.element.getAttribute('disabled')).not.toBeNull()
    fireEvent.click(w.element)
    expect(onUpdate).not.toHaveBeenCalled()

    const removable = mount(
      <Chip removable disabled>
        {label}
      </Chip>,
    )
    expect(removable.element.getAttribute('data-disabled')).not.toBeNull()
    expect(removable.element.querySelector('button')!.getAttribute('disabled')).not.toBeNull()
  })

  it('selectable 与 removable 同时设置时告警并忽略 removable', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const w = mount(
      <Chip selectable removable>
        {label}
      </Chip>,
    )
    expect(warn).toHaveBeenCalledTimes(1)
    expect(w.element.tagName).toBe('BUTTON')
    expect(w.container.querySelectorAll('button')).toHaveLength(1)
    warn.mockRestore()
  })

  it('icon 插槽渲染在文字前', () => {
    const w = mount(<Chip icon={<i data-probe="" />}>{label}</Chip>)
    expect(w.element.querySelector('[data-probe]')).not.toBeNull()
    expect(w.element.firstElementChild?.querySelector('[data-probe]')).not.toBeNull()
  })

  it('无障碍零违例', async () => {
    const selectable = mount(
      <Chip selectable selected>
        {label}
      </Chip>,
    )
    await expectNoA11yViolations(selectable.element)

    const removable = mount(<Chip removable>{label}</Chip>)
    await expectNoA11yViolations(removable.element)
  })
})
