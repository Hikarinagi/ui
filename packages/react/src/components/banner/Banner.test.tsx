import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Banner } from './Banner'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

function mount(ui: ReactNode) {
  const screen = render(ui)
  return { ...screen, element: screen.container }
}

const body = '新版本已发布。'

describe('Banner', () => {
  it('默认 accent 实底、带图标、无实时区域角色；icon 可关、actions 插槽渲染', () => {
    const w = mount(<Banner>{body}</Banner>)
    const bar = w.element.querySelector('[data-tone]')!
    expect(bar.getAttribute('data-tone')).toBe('accent')
    expect(bar.classList).toContain('bg-accent')
    expect(bar.classList).toContain('text-accent-on')
    expect(bar.getAttribute('role')).toBeNull()
    expect(bar.querySelector('svg')).not.toBeNull()
    expect(w.element.textContent).toContain('新版本已发布。')

    const plain = mount(
      <Banner tone="warning" icon={false} actions={<button type="button">延长</button>}>
        {body}
      </Banner>,
    )
    expect(plain.element.querySelector('[data-tone]')!.classList).toContain('bg-warning')
    expect(plain.element.querySelector('svg')).toBeNull()
    expect(plain.element.querySelector('button')!.textContent).toBe('延长')
  })

  it('closable 渲染关闭钮，点击后关闭、触发 close 并回写 open；open 为 false 时不渲染', async () => {
    const onClose = vi.fn()
    const onOpenChange = vi.fn()
    const w = mount(
      <Banner closable onClose={onClose} onOpenChange={onOpenChange}>
        {body}
      </Banner>,
    )
    const close = w.element.querySelector('button')!
    expect(close.getAttribute('aria-label')).toBe('关闭')
    fireEvent.click(close)
    expect(onClose).toHaveBeenCalledTimes(1)
    await vi.waitFor(() => expect(onOpenChange.mock.calls[0]).toEqual([false]))
    await vi.waitFor(() => expect(w.element.querySelector('[data-tone]')).toBeNull())

    const closed = mount(<Banner open={false}>{body}</Banner>)
    expect(closed.element.querySelector('[data-tone]')).toBeNull()
    closed.rerender(<Banner open={true}>{body}</Banner>)
    expect(closed.element.querySelector('[data-tone]')).not.toBeNull()
  })

  it('无障碍零违例', async () => {
    const w = mount(
      <Banner tone="info" closable actions={<button type="button">查看</button>}>
        {body}
      </Banner>,
    )
    await expectNoA11yViolations(w.element)
  })
})
