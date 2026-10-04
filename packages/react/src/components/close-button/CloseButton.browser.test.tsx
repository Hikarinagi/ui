import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { CloseButton } from './CloseButton'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

let mounted: Array<{ unmount: () => Promise<void> }> = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(async () => {
  for (const w of mounted) await w.unmount()
  mounted = []
})

describe('close button · 关闭钮惯例', () => {
  it('默认取 locale 关闭词、ghost/neutral/sm;点击监听穿透到真按钮', async () => {
    const onClick = vi.fn()
    const w = await mount(<CloseButton onClick={onClick} />)
    mounted.push(w)

    const btn = w.container.querySelector('button')!
    expect(btn.getAttribute('aria-label')).toBe('关闭')
    expect(btn.classList).toContain('aspect-square')
    expect(btn.classList).toContain('rounded-full')
    expect(btn.querySelector('svg')).not.toBeNull()

    await userEvent.click(btn)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('disabled 透传;label 可覆写;形状不开放恒为圆', async () => {
    const w = await mount(<CloseButton disabled label="收起面板" />)
    mounted.push(w)
    const btn = w.container.querySelector('button')!
    expect(btn.getAttribute('aria-label')).toBe('收起面板')
    expect(btn.classList).toContain('rounded-full')
    expect(btn.getAttribute('disabled')).not.toBeNull()
  })

  it('xs 档 20px 圆、图标 12px，比 sm 低一档', async () => {
    const xs = await mount(<CloseButton size="xs" />)
    const sm = await mount(<CloseButton />)
    mounted.push(xs, sm)
    const btn = xs.container.querySelector('button')!
    expect(btn.offsetHeight).toBe(20)
    expect(btn.offsetWidth).toBe(20)
    expect(xs.container.querySelector('svg')!.getBoundingClientRect().height).toBe(12)
    expect(sm.container.querySelector('button')!.offsetHeight).toBeGreaterThan(20)
  })
})
