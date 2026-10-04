import { describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { Badge, type BadgeProps } from './Badge'
import { Button } from '../button/Button'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

const anchor = (round = false) => (
  <span
    data-anchor=""
    style={{
      display: 'inline-block',
      width: '40px',
      height: '40px',
      background: '#ddd',
      ...(round ? { borderRadius: '9999px' } : {}),
    }}
  />
)

async function mountBadge(props: BadgeProps, round = false) {
  const w = await mount(<Badge {...props}>{anchor(round)}</Badge>)
  w.container.style.cssText = 'padding: 24px'
  const host = w.element.querySelector('[data-anchor]') as HTMLElement
  const pill = [...w.element.querySelectorAll('span')].find(
    el => el !== w.element && !el.hasAttribute('data-anchor') && el.textContent?.trim(),
  ) as HTMLElement
  return { w, host, pill }
}

const center = (el: HTMLElement) => {
  const r = el.getBoundingClientRect()
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
}

describe('badge · 锚定徽标', () => {
  it('rect 宿主:徽标中心压在右上角点;正圆、实底、surface 描边', async () => {
    const { host, pill } = await mountBadge({ content: 5 })
    const c = center(pill)
    const r = host.getBoundingClientRect()
    expect(Math.abs(c.x - r.right)).toBeLessThan(2)
    expect(Math.abs(c.y - r.top)).toBeLessThan(2)
    const cs = getComputedStyle(pill)
    expect(pill.offsetWidth).toBe(pill.offsetHeight)
    expect(parseFloat(cs.borderTopLeftRadius)).toBeGreaterThanOrEqual(pill.offsetHeight / 2)
    expect(cs.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(cs.boxShadow).not.toBe('none')
  })

  it('circle 宿主:角点内收,徽标中心落在圆内角', async () => {
    const { host, pill } = await mountBadge({ content: 5, shape: 'circle' }, true)
    const c = center(pill)
    const r = host.getBoundingClientRect()
    expect(c.x).toBeLessThan(r.right - 2)
    expect(c.y).toBeGreaterThan(r.top + 2)
  })

  it('多字自然长成胶囊;bottom-start 落在左下', async () => {
    const { pill } = await mountBadge({ content: 'NEW', placement: 'bottom-start' })
    expect(pill.offsetWidth).toBeGreaterThan(pill.offsetHeight)
    const { host, pill: p2 } = await mountBadge({ content: 7, placement: 'bottom-start' })
    const c = center(p2)
    const r = host.getBoundingClientRect()
    expect(Math.abs(c.x - r.left)).toBeLessThan(2)
    expect(Math.abs(c.y - r.bottom)).toBeLessThan(2)
  })

  it('有进必有出:内容归零时徽标走出场过渡再卸载', async () => {
    const { w } = await mountBadge({ content: 5 })
    const spans = () => w.container.querySelectorAll('span').length
    const before = spans()
    await w.rerender(<Badge content={0}>{anchor()}</Badge>)
    expect(spans()).toBe(before)
    await vi.waitFor(() => expect(spans()).toBe(before - 1), { timeout: 1500 })
  })
})

it.each([false, true])('角标覆盖的按钮区域仍能点击，bare=%s', async bare => {
  const onClick = vi.fn()
  const w = await mount(
    <Badge content={bare ? <span className="inline-flex size-4">5</span> : 5} bare={bare}>
      <Button onClick={onClick} ripple={false} className="size-10 rounded-none p-0">
        通知
      </Button>
    </Badge>,
  )
  w.container.style.cssText = 'padding: 24px'
  const button = w.element.querySelector('button')!
  const pill = w.element.lastElementChild as HTMLElement
  const hostRect = button.getBoundingClientRect()
  const pillRect = pill.getBoundingClientRect()
  expect(pillRect.width).toBeGreaterThan(0)
  expect(pillRect.height).toBeGreaterThan(0)
  const rootRect = w.element.getBoundingClientRect()
  const x = (Math.max(hostRect.left, pillRect.left) + Math.min(hostRect.right, pillRect.right)) / 2
  const y = (Math.max(hostRect.top, pillRect.top) + Math.min(hostRect.bottom, pillRect.bottom)) / 2
  const target = document.elementFromPoint(x, y)

  await userEvent.click(w.element, { position: { x: x - rootRect.left, y: y - rootRect.top } })

  expect(onClick).toHaveBeenCalledOnce()
  expect(button.contains(target)).toBe(true)
})
