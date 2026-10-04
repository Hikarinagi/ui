import { describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import type { ReactNode } from 'react'
import { Mail } from 'lucide-react'
import { lucide } from '../../lib/icon'
import { Input } from './Input'
import { Card } from '../card/Card'
import '../../../test/browser.css'

const MailIcon = lucide(Mail)

function attach() {
  const host = document.createElement('div')
  document.body.appendChild(host)
  return host
}

async function mountIn(ui: ReactNode) {
  const host = attach()
  const screen = await render(ui, { container: host })
  return { ...screen, element: host.firstElementChild as HTMLElement }
}

async function parkPointer() {
  const spot = document.createElement('div')
  spot.style.cssText = 'position: fixed; right: 0; bottom: 0; width: 8px; height: 8px'
  document.body.appendChild(spot)
  await userEvent.hover(spot)
  spot.remove()
}

describe('input 真实交互:墨在填充里,不在边框与 ring 上', () => {
  it('hover 时填充落墨、边框不动;focus 后墨退净回本色', async () => {
    await parkPointer()
    const { element: el } = await mountIn(<Input aria-label="普通" />)
    const input = el.querySelector('input') as HTMLElement
    const restBg = getComputedStyle(el).backgroundColor
    const restBorder = getComputedStyle(el).borderColor

    await userEvent.hover(el)
    await vi.waitFor(() => expect(getComputedStyle(el).backgroundColor).not.toBe(restBg))
    expect(getComputedStyle(el).borderColor).toBe(restBorder)

    await userEvent.click(input)
    await vi.waitFor(() => expect(getComputedStyle(el).backgroundColor).toBe(restBg))
  })

  it('focus 环从边缘长出:spread 0→2px 恒色相,阴影层纹丝不动', async () => {
    const probe = document.createElement('span')
    probe.style.color = 'var(--hn-accent)'
    document.body.appendChild(probe)
    const accent = getComputedStyle(probe).color

    const { element: el } = await mountIn(<Input aria-label="聚焦" />)
    const input = el.querySelector('input') as HTMLElement
    const restShadow = getComputedStyle(el).boxShadow
    expect(restShadow).toContain(`${accent} 0px 0px 0px 0px`)

    await userEvent.click(input)
    expect(document.activeElement).toBe(input)
    expect(getComputedStyle(el).transitionDuration).toContain('0.2s')

    const focusShadow = restShadow.replace('0px 0px 0px 0px', '0px 0px 0px 2px')
    expect(getComputedStyle(el).boxShadow).not.toBe(focusShadow)
    await vi.waitFor(() => expect(getComputedStyle(el).boxShadow).toBe(focusShadow))
    expect(getComputedStyle(el).borderColor).not.toBe(accent)

    const { element: flatEl } = await mountIn(<Input variant="secondary" aria-label="扁平聚焦" />)
    await userEvent.click(flatEl.querySelector('input') as HTMLElement)
    await vi.waitFor(() =>
      expect(getComputedStyle(flatEl).boxShadow).toContain(`${accent} 0px 0px 0px 2px`),
    )
  })

  it('invalid 聚焦时长出的环是 danger,不被 accent 抢走', async () => {
    const probe = document.createElement('span')
    probe.style.color = 'var(--hn-danger)'
    document.body.appendChild(probe)
    const danger = getComputedStyle(probe).color

    const { element: badEl } = await mountIn(<Input invalid aria-label="错误聚焦" />)
    const invalidBorder = getComputedStyle(badEl).borderColor

    await userEvent.click(badEl.querySelector('input') as HTMLElement)
    await vi.waitFor(() =>
      expect(getComputedStyle(badEl).boxShadow).toContain(`${danger} 0px 0px 0px 1px`),
    )
    expect(getComputedStyle(badEl).borderColor).toBe(invalidBorder)
  })

  it('invalid 与常态同一套交互生命:hover 在 danger 淡墨上再落墨,border 保持 danger', async () => {
    const { element: ok } = await mountIn(<Input aria-label="普通" />)
    const { element: badEl } = await mountIn(<Input invalid aria-label="错误" />)
    const okStyle = getComputedStyle(ok)
    const badStyle = getComputedStyle(badEl)
    expect(badStyle.borderColor).not.toBe(okStyle.borderColor)
    expect(badStyle.backgroundColor).not.toBe(okStyle.backgroundColor)
    const elevation = (s: string) => s.slice(s.indexOf('0px 0px 0px 0px,'))
    expect(elevation(badStyle.boxShadow)).toBe(elevation(okStyle.boxShadow))

    const invalidBg = badStyle.backgroundColor
    const invalidBorder = badStyle.borderColor
    await userEvent.hover(badEl)
    await vi.waitFor(() => expect(getComputedStyle(badEl).backgroundColor).not.toBe(invalidBg))
    expect(getComputedStyle(badEl).borderColor).toBe(invalidBorder)
  })

  it('secondary 扁平形态:无阴影,primary 带 surface 阴影', async () => {
    const { element: primary } = await mountIn(<Input aria-label="主" />)
    const { element: secondary } = await mountIn(<Input variant="secondary" aria-label="次" />)
    expect(getComputedStyle(primary).boxShadow).toMatch(/0\.0[1-9]/)
    expect(getComputedStyle(secondary).boxShadow).not.toMatch(/0\.0[1-9]/)
    expect(getComputedStyle(secondary).backgroundColor).not.toBe(
      getComputedStyle(primary).backgroundColor,
    )
  })
})

describe('card 无自带 hover 效果', () => {
  it('hover 卡片,边框与阴影纹丝不动 —— 升档效果是被禁止的', async () => {
    const { element: el } = await mountIn(<Card>静态</Card>)
    const restBorder = getComputedStyle(el).borderColor
    const restShadow = getComputedStyle(el).boxShadow

    await userEvent.hover(el)
    await new Promise(resolve => setTimeout(resolve, 180))
    expect(getComputedStyle(el).borderColor).toBe(restBorder)
    expect(getComputedStyle(el).boxShadow).toBe(restShadow)
  })
})

describe('附属件方格', () => {
  it('每格是控件高的正方形，清除钮就是整格、贴着宿主内缘；清除后焦点仍在输入区', async () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const { element: root } = await mountIn(
        <Input size={size} clearable defaultValue="星见" aria-label={size} />,
      )
      const box = root.querySelector(':scope > span') as HTMLElement
      const button = box.querySelector('button') as HTMLElement
      expect(box.getBoundingClientRect().width).toBe(root.offsetHeight)
      expect(getComputedStyle(root.querySelector('input')!).paddingInlineEnd).toBe('0px')
      expect(button.getBoundingClientRect().width).toBe(root.offsetHeight)
      expect(box.getBoundingClientRect().right - button.getBoundingClientRect().right).toBe(0)
      expect(root.getBoundingClientRect().right - button.getBoundingClientRect().right).toBe(
        parseFloat(getComputedStyle(root).borderRightWidth),
      )
    }

    const { element: root } = await mountIn(
      <Input clearable defaultValue="星见" aria-label="清除" />,
    )
    const input = root.querySelector('input') as HTMLInputElement
    await userEvent.click(input)
    await userEvent.click(root.querySelector('button') as HTMLElement)
    await vi.waitFor(() => expect(input.value).toBe(''))
    expect(document.activeElement).toBe(input)
  })
})

describe('loading 切换有过渡', () => {
  it('有 leading 时图标淡出、Spinner 淡入；无 leading 时末尾方格淡入，都能抓到中间帧', async () => {
    const mid = (el: Element) => {
      const opacity = parseFloat(getComputedStyle(el).opacity)
      expect(opacity).toBeGreaterThan(0)
      expect(opacity).toBeLessThan(1)
    }

    const swapped = await mountIn(
      <Input loading={false} leading={<MailIcon />} aria-label="交接" />,
    )
    const box = swapped.element.querySelector(':scope > span') as HTMLElement
    const icon = box.querySelector('svg')!.parentElement as HTMLElement
    expect(getComputedStyle(icon).transitionDuration).toContain('0.2s')
    await swapped.rerender(<Input loading leading={<MailIcon />} aria-label="交接" />)
    await vi.waitFor(() => mid(icon))
    const spinner = box.querySelector('[role="status"]')!.parentElement as HTMLElement
    await vi.waitFor(() => mid(spinner))
    await vi.waitFor(() => expect(getComputedStyle(icon).opacity).toBe('0'))
    await vi.waitFor(() => expect(getComputedStyle(spinner).opacity).toBe('1'))

    const tail = await mountIn(<Input loading={false} aria-label="末尾" />)
    await tail.rerender(<Input loading aria-label="末尾" />)
    const tailBox = tail.element.querySelector(':scope > span') as HTMLElement
    await vi.waitFor(() => mid(tailBox))
    await vi.waitFor(() => expect(getComputedStyle(tailBox).opacity).toBe('1'))
    await tail.rerender(<Input loading={false} aria-label="末尾" />)
    await vi.waitFor(() => mid(tailBox))
  })
})

describe('点击附属格即聚焦', () => {
  it('点起始格光标到开头，点末尾格光标到末尾，点清除钮不算', async () => {
    const { element: root } = await mountIn(
      <Input
        defaultValue="shion"
        clearable
        leading={<MailIcon />}
        trailing="kg"
        aria-label="附属格"
      />,
    )
    const boxes = Array.from(root.querySelectorAll(':scope > span')) as HTMLElement[]
    const input = root.querySelector('input') as HTMLInputElement
    expect(boxes).toHaveLength(3)

    await userEvent.click(boxes[0]!)
    expect(document.activeElement).toBe(input)
    expect(input.selectionStart).toBe(0)

    await userEvent.click(boxes[2]!)
    expect(document.activeElement).toBe(input)
    expect(input.selectionStart).toBe(5)

    const clear = boxes[1]!.querySelector('button') as HTMLElement
    await userEvent.click(clear)
    await vi.waitFor(() => expect(input.value).toBe(''))
    expect(document.activeElement).toBe(input)
  })
})
