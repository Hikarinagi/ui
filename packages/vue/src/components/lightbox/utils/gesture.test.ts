import { describe, expect, it } from 'vitest'
import {
  DOUBLE_TAP_DISTANCE,
  DOUBLE_TAP_MS,
  DRAG_THRESHOLD,
  TAP_MAX_DISTANCE,
  TAP_MAX_MS,
  WHEEL_LINE,
  distance,
  dragAxis,
  isDoubleTap,
  isTap,
  midpoint,
  wheelDelta,
} from './gesture'

describe('midpoint 与 distance', () => {
  it('两点中点与欧氏距离', () => {
    expect(midpoint({ x: 0, y: 0 }, { x: 100, y: 50 })).toEqual({ x: 50, y: 25 })
    expect(distance({ x: 0, y: 0 }, { x: 30, y: 40 })).toBe(50)
  })
})

describe('dragAxis', () => {
  it('未超过阈值时不判定方向', () => {
    expect(dragAxis({ x: 0, y: 0 }, { x: DRAG_THRESHOLD - 1, y: 0 })).toBeNull()
  })

  it('超过阈值后取位移更大的轴', () => {
    expect(dragAxis({ x: 0, y: 0 }, { x: 10, y: 3 })).toBe('x')
    expect(dragAxis({ x: 0, y: 0 }, { x: -3, y: -10 })).toBe('y')
  })
})

describe('isTap 与 isDoubleTap', () => {
  it('位移小且时间短才是轻点', () => {
    expect(isTap({ x: 0, y: 0, time: 0 }, { x: 5, y: 5, time: TAP_MAX_MS })).toBe(true)
    expect(isTap({ x: 0, y: 0, time: 0 }, { x: TAP_MAX_DISTANCE + 1, y: 0, time: 10 })).toBe(false)
    expect(isTap({ x: 0, y: 0, time: 0 }, { x: 0, y: 0, time: TAP_MAX_MS + 1 })).toBe(false)
  })

  it('两次轻点间隔短且位置近才是双击', () => {
    const first = { x: 100, y: 100, time: 1000 }
    expect(isDoubleTap(null, first)).toBe(false)
    expect(isDoubleTap(first, { x: 110, y: 100, time: 1000 + DOUBLE_TAP_MS })).toBe(true)
    expect(isDoubleTap(first, { x: 100, y: 100, time: 1000 + DOUBLE_TAP_MS + 1 })).toBe(false)
    expect(isDoubleTap(first, { x: 100 + DOUBLE_TAP_DISTANCE + 1, y: 100, time: 1100 })).toBe(false)
  })
})

describe('wheelDelta', () => {
  it('像素模式原样,行模式乘行高,页模式乘舞台高度', () => {
    expect(wheelDelta(120, 0, 800)).toBe(120)
    expect(wheelDelta(3, 1, 800)).toBe(3 * WHEEL_LINE)
    expect(wheelDelta(1, 2, 800)).toBe(800)
  })
})
