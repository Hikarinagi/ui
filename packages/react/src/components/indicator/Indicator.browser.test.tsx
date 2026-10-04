import { describe, expect, it } from 'vitest'
import { Indicator, type IndicatorProps } from './Indicator'
import { Badge } from '../badge/Badge'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

async function mountDot(props: IndicatorProps = {}) {
  const w = await mount(<Indicator {...props} />)
  return w.element
}

function toMs(value: string) {
  return value.endsWith('ms') ? parseFloat(value) : parseFloat(value) * 1000
}

describe('indicator · 状态点', () => {
  it('三档尺寸 6 / 8 / 10，恒圆', async () => {
    expect((await mountDot({ size: 'sm' })).offsetHeight).toBe(6)
    const md = await mountDot()
    expect(md.offsetHeight).toBe(8)
    expect(md.offsetWidth).toBe(8)
    expect((await mountDot({ size: 'lg' })).offsetHeight).toBe(10)
    expect(parseFloat(getComputedStyle(md).borderTopLeftRadius)).toBeGreaterThanOrEqual(4)
  })

  it('语义 tone 各着各色，默认中性', async () => {
    const neutral = getComputedStyle(await mountDot()).backgroundColor
    const success = getComputedStyle(await mountDot({ tone: 'success' })).backgroundColor
    const danger = getComputedStyle(await mountDot({ tone: 'danger' })).backgroundColor
    expect(neutral).not.toBe('rgba(0, 0, 0, 0)')
    expect(success).not.toBe(neutral)
    expect(success).not.toBe(danger)
  })

  it('pulse 的扩散层同色、跑 hn-ping、时长取 token', async () => {
    const dot = await mountDot({ tone: 'success', pulse: true })
    const ping = dot.querySelector('.hn-ping') as HTMLElement
    const cs = getComputedStyle(ping)
    expect(cs.backgroundColor).toBe(getComputedStyle(dot).backgroundColor)
    expect(cs.animationName).toBe('hn-ping')
    expect(cs.animationIterationCount).toBe('infinite')
    const token = getComputedStyle(document.documentElement).getPropertyValue('--hn-pulse-duration')
    expect(toMs(cs.animationDuration)).toBe(toMs(token.trim()))
  })

  it('钉进 bare 的 Badge：气泡不画底，尺寸就是圆点', async () => {
    const w = await mount(
      <Badge content={<Indicator tone="success" />} bare label="在线" placement="bottom-end">
        <span style={{ display: 'inline-block', width: '40px', height: '40px' }} />
      </Badge>,
    )
    const bubble = w.element.querySelector('.absolute') as HTMLElement
    expect(getComputedStyle(bubble).backgroundColor).toBe('rgba(0, 0, 0, 0)')
    expect(bubble.offsetHeight).toBe(8)
    expect(bubble.offsetWidth).toBe(8)
    expect(getComputedStyle(bubble).boxShadow).not.toBe('none')
  })
})
