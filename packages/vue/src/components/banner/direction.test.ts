import { describe, expect, it } from 'vitest'
import { bannerSlide } from './banner.variants'
import { stepBetween } from './utils/direction'

describe('公告切换方向', () => {
  it('相邻为前进或后退,首尾相接按环判断,跳跃按大小判断', () => {
    expect(stepBetween(0, 1, 3)).toBe(1)
    expect(stepBetween(1, 0, 3)).toBe(-1)
    expect(stepBetween(2, 0, 3)).toBe(1)
    expect(stepBetween(0, 2, 3)).toBe(-1)
    expect(stepBetween(0, 3, 5)).toBe(1)
    expect(stepBetween(4, 1, 5)).toBe(-1)
    expect(stepBetween(0, 0, 1)).toBe(1)
  })

  it('前进从末端进、往起端出;后退相反;RTL 镜像', () => {
    const { forward, backward } = bannerSlide
    expect(forward.enterFrom).toContain('translate-x-4')
    expect(forward.enterFrom).toContain('rtl:-translate-x-4')
    expect(forward.leaveTo).toContain('-translate-x-4')
    expect(backward.enterFrom).toBe(forward.leaveTo)
    expect(backward.leaveTo).toBe(forward.enterFrom)
  })
})
