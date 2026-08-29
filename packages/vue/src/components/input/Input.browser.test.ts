import { describe, expect, it, vi, beforeEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount } from '@vue/test-utils'
import Input from './Input.vue'
import Card from '../card/Card.vue'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

function attach() {
  const host = document.createElement('div')
  document.body.appendChild(host)
  return host
}

describe('input 真实交互:墨在填充里,不在边框与 ring 上', () => {
  it('hover 时填充落墨、边框不动;focus 后墨退净回本色', async () => {
    const w = mount(Input, { attrs: { 'aria-label': '普通' }, attachTo: attach() })
    const el = w.element as HTMLElement
    const restBg = getComputedStyle(el).backgroundColor
    const restBorder = getComputedStyle(el).borderColor

    await userEvent.hover(el)
    await vi.waitFor(() => expect(getComputedStyle(el).backgroundColor).not.toBe(restBg))
    expect(getComputedStyle(el).borderColor).toBe(restBorder)

    await userEvent.click(el)
    await vi.waitFor(() => expect(getComputedStyle(el).backgroundColor).toBe(restBg))
  })

  it('focus = 边框着色,无 ring;secondary 的 accent 线从无到有', async () => {
    const probe = document.createElement('span')
    probe.style.color = 'var(--hn-accent)'
    document.body.appendChild(probe)
    const accent = getComputedStyle(probe).color

    const w = mount(Input, { attrs: { 'aria-label': '聚焦' }, attachTo: attach() })
    const el = w.element as HTMLElement
    const restShadow = getComputedStyle(el).boxShadow
    expect(getComputedStyle(el).outlineColor).toBe('rgba(0, 0, 0, 0)')

    await userEvent.click(el)
    expect(document.activeElement).toBe(el)
    const midway = getComputedStyle(el).outlineColor
    expect(midway).not.toBe(accent)

    await vi.waitFor(() => expect(getComputedStyle(el).outlineColor).toBe(accent))
    expect(getComputedStyle(el).borderColor).toBe(accent)
    expect(getComputedStyle(el).boxShadow).toBe(restShadow)

    const flat = mount(Input, {
      props: { variant: 'secondary' },
      attrs: { 'aria-label': '扁平聚焦' },
      attachTo: attach(),
    })
    const flatEl = flat.element as HTMLElement
    await userEvent.click(flatEl)
    await vi.waitFor(() => expect(getComputedStyle(flatEl).borderColor).toBe(accent))
  })

  it('invalid 聚焦时粗边是 danger,不被 accent 抢走', async () => {
    const probe = document.createElement('span')
    probe.style.color = 'var(--hn-danger)'
    document.body.appendChild(probe)
    const danger = getComputedStyle(probe).color

    const bad = mount(Input, {
      props: { invalid: true },
      attrs: { 'aria-label': '错误聚焦' },
      attachTo: attach(),
    })
    const badEl = bad.element as HTMLElement
    const invalidBorder = getComputedStyle(badEl).borderColor

    await userEvent.click(badEl)
    await vi.waitFor(() => expect(getComputedStyle(badEl).outlineColor).toBe(danger))
    expect(getComputedStyle(badEl).borderColor).toBe(invalidBorder)
  })

  it('invalid 与常态同一套交互生命:hover 在 danger 淡墨上再落墨,border 保持 danger', async () => {
    const ok = mount(Input, { attrs: { 'aria-label': '普通' }, attachTo: attach() })
    const bad = mount(Input, {
      props: { invalid: true },
      attrs: { 'aria-label': '错误' },
      attachTo: attach(),
    })
    const badEl = bad.element as HTMLElement
    const okStyle = getComputedStyle(ok.element as HTMLElement)
    const badStyle = getComputedStyle(badEl)
    expect(badStyle.borderColor).not.toBe(okStyle.borderColor)
    expect(badStyle.backgroundColor).not.toBe(okStyle.backgroundColor)
    expect(badStyle.boxShadow).toBe(okStyle.boxShadow)

    const invalidBg = badStyle.backgroundColor
    const invalidBorder = badStyle.borderColor
    await userEvent.hover(badEl)
    await vi.waitFor(() => expect(getComputedStyle(badEl).backgroundColor).not.toBe(invalidBg))
    expect(getComputedStyle(badEl).borderColor).toBe(invalidBorder)
  })

  it('secondary 扁平形态:无阴影,primary 带 surface 阴影', async () => {
    const primary = mount(Input, { attrs: { 'aria-label': '主' }, attachTo: attach() })
    const secondary = mount(Input, {
      props: { variant: 'secondary' },
      attrs: { 'aria-label': '次' },
      attachTo: attach(),
    })
    expect(getComputedStyle(primary.element as HTMLElement).boxShadow).toMatch(/0\.0[1-9]/)
    expect(getComputedStyle(secondary.element as HTMLElement).boxShadow).not.toMatch(/0\.0[1-9]/)
    expect(getComputedStyle(secondary.element as HTMLElement).backgroundColor).not.toBe(
      getComputedStyle(primary.element as HTMLElement).backgroundColor,
    )
  })
})

describe('card 无自带 hover 效果', () => {
  it('hover 卡片,边框与阴影纹丝不动 —— 升档效果是被禁止的', async () => {
    const w = mount(Card, { slots: { default: () => '静态' }, attachTo: attach() })
    const el = w.element as HTMLElement
    const restBorder = getComputedStyle(el).borderColor
    const restShadow = getComputedStyle(el).boxShadow

    await userEvent.hover(el)
    await new Promise(resolve => setTimeout(resolve, 180))
    expect(getComputedStyle(el).borderColor).toBe(restBorder)
    expect(getComputedStyle(el).boxShadow).toBe(restShadow)
  })
})
