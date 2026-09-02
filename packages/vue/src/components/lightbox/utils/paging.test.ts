import { describe, expect, it } from 'vitest'
import {
  PAGE_COMMIT,
  PAGE_PROJECTION,
  PAGE_VELOCITY,
  clampIndex,
  edgePosition,
  pageSteps,
  shortestDelta,
  wrapIndex,
} from './paging'

const width = 1000

describe('pageSteps', () => {
  it('慢慢拖不到位且没有甩动时退回', () => {
    expect(pageSteps(-width * PAGE_COMMIT + 1, 0, width)).toBe(0)
    expect(pageSteps(width * PAGE_COMMIT - 1, 0, width)).toBe(0)
  })

  it('拖过提交距离后向拖动方向翻一页', () => {
    expect(pageSteps(-width * PAGE_COMMIT, 0, width)).toBe(1)
    expect(pageSteps(width * PAGE_COMMIT, 0, width)).toBe(-1)
  })

  it('轻轻一甩也能翻,方向跟甩动方向', () => {
    expect(pageSteps(-20, -PAGE_VELOCITY, width)).toBe(1)
    expect(pageSteps(20, PAGE_VELOCITY, width)).toBe(-1)
  })

  it('甩得再快也只翻一张', () => {
    const velocity = -(width * 2.4) / PAGE_PROJECTION
    expect(pageSteps(-100, velocity, width)).toBe(1)
    expect(pageSteps(100, -velocity, width)).toBe(-1)
  })

  it('拖过提交距离但反向甩回时以投影位置为准', () => {
    expect(pageSteps(-300, 2000, width)).toBe(-1)
  })

  it('宽度为零时不翻页', () => {
    expect(pageSteps(-500, -5000, 0)).toBe(0)
  })
})

describe('clampIndex', () => {
  it('夹在首尾之间,空组返回零', () => {
    expect(clampIndex(-3, 5)).toBe(0)
    expect(clampIndex(9, 5)).toBe(4)
    expect(clampIndex(2, 5)).toBe(2)
    expect(clampIndex(2, 0)).toBe(0)
  })
})

describe('wrapIndex 与 shortestDelta', () => {
  it('wrapIndex 把任意整数折回组内', () => {
    expect(wrapIndex(4, 4)).toBe(0)
    expect(wrapIndex(-1, 4)).toBe(3)
    expect(wrapIndex(9, 4)).toBe(1)
    expect(wrapIndex(2, 0)).toBe(0)
  })

  it('shortestDelta 取环上最短的一段,平局向前', () => {
    expect(shortestDelta(1, 4)).toBe(1)
    expect(shortestDelta(-1, 4)).toBe(-1)
    expect(shortestDelta(3, 4)).toBe(-1)
    expect(shortestDelta(-3, 4)).toBe(1)
    expect(shortestDelta(2, 4)).toBe(2)
    expect(shortestDelta(1, 2)).toBe(1)
    expect(shortestDelta(-1, 2)).toBe(1)
  })
})

describe('edgePosition', () => {
  it('首尾之间的位置原样返回', () => {
    expect(edgePosition(-1300, 3, width)).toBe(-1300)
    expect(edgePosition(-700, 3, width)).toBe(-700)
  })

  it('越过第一页有阻力', () => {
    const resisted = edgePosition(300, 3, width)
    expect(resisted).toBeGreaterThan(0)
    expect(resisted).toBeLessThan(300)
  })

  it('越过最后一页有阻力', () => {
    const resisted = edgePosition(-2300, 3, width)
    expect(resisted).toBeLessThan(-2000)
    expect(resisted).toBeGreaterThan(-2300)
  })

  it('只有一张时两个方向都有阻力', () => {
    expect(Math.abs(edgePosition(300, 1, width))).toBeLessThan(300)
    expect(Math.abs(edgePosition(-300, 1, width))).toBeLessThan(300)
  })
})
