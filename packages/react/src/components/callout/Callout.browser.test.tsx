import { describe, expect, it } from 'vitest'
import { Callout, type CalloutProps } from './Callout'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

function mountCallout(props: CalloutProps = {}, text = '正文内容。') {
  return mount(<Callout {...props}>{text}</Callout>)
}

type Mounted = Awaited<ReturnType<typeof mountCallout>>

describe('callout · 文档提示块', () => {
  it('默认中性:role=note、subtle 底、带图标与正文', async () => {
    const w = await mountCallout({ title: '备注' })
    const el = w.element
    expect(el.getAttribute('role')).toBe('note')
    expect(getComputedStyle(el).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(el.querySelector('svg')).not.toBeNull()
    expect(el.textContent).toContain('备注')
    expect(el.textContent).toContain('正文内容。')
  })

  it('六 tone 各着各底,图标随 tone 换色换形', async () => {
    const neutral = await mountCallout()
    const warning = await mountCallout({ tone: 'warning' })
    const danger = await mountCallout({ tone: 'danger' })

    const bg = (w: Mounted) => getComputedStyle(w.element).backgroundColor
    expect(bg(warning)).not.toBe(bg(neutral))
    expect(bg(danger)).not.toBe(bg(warning))

    const svg = (w: Mounted) => w.element.querySelector('svg')!
    expect(svg(warning).innerHTML).not.toBe(svg(danger).innerHTML)
    expect(getComputedStyle(svg(warning)).color).not.toBe(getComputedStyle(svg(danger)).color)
  })

  it('icon=false 无图标;#icon 槽可整体替换', async () => {
    const off = await mountCallout({ icon: false })
    expect(off.element.querySelector('svg')).toBeNull()

    const custom = await mount(<Callout icon="☆">文</Callout>)
    expect(custom.element.querySelector('svg')).toBeNull()
    expect(custom.element.textContent).toContain('☆')
  })
})
