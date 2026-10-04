import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Alert } from './Alert'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

function mount(ui: ReactNode) {
  const screen = render(ui)
  return { ...screen, element: screen.container }
}

const body = '已保存到草稿箱。'

describe('结构与语义', () => {
  it('默认 status 角色、带图标；danger 与 warning 升为 alert', () => {
    const w = mount(<Alert>{body}</Alert>)
    const region = w.element.querySelector('[role]')!
    expect(region.getAttribute('role')).toBe('status')
    expect(region.querySelector('svg')).not.toBeNull()
    expect(w.element.textContent).toContain('已保存到草稿箱。')

    expect(
      mount(<Alert tone="danger">{body}</Alert>)
        .element.querySelector('[role]')!
        .getAttribute('role'),
    ).toBe('alert')
    expect(
      mount(<Alert tone="warning">{body}</Alert>)
        .element.querySelector('[role]')!
        .getAttribute('role'),
    ).toBe('alert')
    expect(
      mount(<Alert tone="success">{body}</Alert>)
        .element.querySelector('[role]')!
        .getAttribute('role'),
    ).toBe('status')
  })

  it('title 渲染在正文前；icon 可关；actions 插槽渲染', () => {
    const w = mount(
      <Alert title="草稿已保存" icon={false} actions={<button type="button">查看</button>}>
        {body}
      </Alert>,
    )
    expect(w.element.querySelector('p')!.textContent).toBe('草稿已保存')
    expect(w.element.querySelector('svg')).toBeNull()
    expect(w.element.querySelector('button')!.textContent).toBe('查看')
  })

  it('closable 渲染关闭钮，点击后关闭、触发 close 并回写 open', async () => {
    const onClose = vi.fn()
    const onOpenChange = vi.fn()
    const w = mount(
      <Alert closable onClose={onClose} onOpenChange={onOpenChange}>
        {body}
      </Alert>,
    )
    const close = w.element.querySelector('button')!
    expect(close.getAttribute('aria-label')).toBe('关闭')

    fireEvent.click(close)
    expect(onClose).toHaveBeenCalledTimes(1)
    await vi.waitFor(() => expect(onOpenChange.mock.calls[0]).toEqual([false]))
    await vi.waitFor(() => expect(w.element.querySelector('[role]')).toBeNull())
  })

  it('open 为 false 时不渲染，改回 true 后出现', () => {
    const w = mount(<Alert open={false}>{body}</Alert>)
    expect(w.element.querySelector('[role]')).toBeNull()
    w.rerender(<Alert open={true}>{body}</Alert>)
    expect(w.element.querySelector('[role]')).not.toBeNull()
  })

  it('无障碍零违例', async () => {
    const w = mount(
      <Alert tone="danger" title="发布失败" closable actions={<button type="button">重试</button>}>
        {body}
      </Alert>,
    )
    await expectNoA11yViolations(w.element)
  })
})
