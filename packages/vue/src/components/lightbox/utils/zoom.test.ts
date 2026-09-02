import { describe, expect, it } from 'vitest'
import {
  OVERSHOOT,
  ZOOM_DOUBLE_TAP,
  ZOOM_MAX,
  ZOOM_MIN,
  ZOOM_STEP,
  clampOffset,
  clampZoom,
  doubleTapZoom,
  elasticOffset,
  elasticZoom,
  fitSize,
  panBounds,
  pinchZoom,
  rotatedSize,
  rubberBand,
  stepZoom,
  wheelZoom,
  zoomAbout,
} from './zoom'

const stage = { width: 1000, height: 800 }

describe('rotatedSize', () => {
  it('0 与 180 度保持原样', () => {
    expect(rotatedSize({ width: 300, height: 200 }, 0)).toEqual({ width: 300, height: 200 })
    expect(rotatedSize({ width: 300, height: 200 }, 180)).toEqual({ width: 300, height: 200 })
    expect(rotatedSize({ width: 300, height: 200 }, 360)).toEqual({ width: 300, height: 200 })
  })

  it('90 与 270 度交换宽高,负角度同样成立', () => {
    expect(rotatedSize({ width: 300, height: 200 }, 90)).toEqual({ width: 200, height: 300 })
    expect(rotatedSize({ width: 300, height: 200 }, 270)).toEqual({ width: 200, height: 300 })
    expect(rotatedSize({ width: 300, height: 200 }, -90)).toEqual({ width: 200, height: 300 })
  })
})

describe('fitSize', () => {
  it('横图按宽度贴合舞台', () => {
    expect(fitSize({ width: 4000, height: 2000 }, stage)).toEqual({ width: 1000, height: 500 })
  })

  it('竖图按高度贴合舞台', () => {
    expect(fitSize({ width: 1000, height: 2000 }, stage)).toEqual({ width: 400, height: 800 })
  })

  it('小图同样撑满舞台,盒子只由宽高比决定', () => {
    expect(fitSize({ width: 100, height: 50 }, stage)).toEqual({ width: 1000, height: 500 })
  })

  it('旋转 90 度后按旋转后的盒子贴合', () => {
    expect(fitSize({ width: 4000, height: 2000 }, stage, 90)).toEqual({ width: 400, height: 800 })
  })

  it('尺寸缺失时返回零盒而不是 NaN', () => {
    expect(fitSize({ width: 0, height: 0 }, stage)).toEqual({ width: 0, height: 0 })
  })
})

describe('panBounds 与 clampOffset', () => {
  it('画面小于舞台时两轴都锁在中心', () => {
    expect(panBounds({ width: 800, height: 600 }, stage)).toEqual({
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0,
    })
  })

  it('画面大于舞台时可移动半个差值,按轴独立', () => {
    expect(panBounds({ width: 3000, height: 600 }, stage)).toEqual({
      minX: -1000,
      maxX: 1000,
      minY: 0,
      maxY: 0,
    })
  })

  it('clampOffset 把越界位移夹回范围', () => {
    const bounds = panBounds({ width: 3000, height: 2400 }, stage)
    expect(clampOffset({ x: 5000, y: -5000 }, bounds)).toEqual({ x: 1000, y: -800 })
    expect(clampOffset({ x: 10, y: -20 }, bounds)).toEqual({ x: 10, y: -20 })
  })
})

describe('zoomAbout', () => {
  it('以画面中心缩放时位移不变', () => {
    const offset = { x: 40, y: -30 }
    expect(zoomAbout(offset, 1, 3, offset)).toEqual(offset)
  })

  it('画面居中且以舞台中心缩放时仍居中', () => {
    expect(zoomAbout({ x: 0, y: 0 }, 1, 2.5, { x: 0, y: 0 })).toEqual({ x: 0, y: 0 })
  })

  it('焦点下方的图像点在缩放前后保持不动', () => {
    const offset = { x: 20, y: 10 }
    const focal = { x: 150, y: -90 }
    const zoom = 1.4
    const next = 3.2
    const pointOnImage = { x: (focal.x - offset.x) / zoom, y: (focal.y - offset.y) / zoom }
    const moved = zoomAbout(offset, zoom, next, focal)
    expect(moved.x + pointOnImage.x * next).toBeCloseTo(focal.x)
    expect(moved.y + pointOnImage.y * next).toBeCloseTo(focal.y)
  })

  it('缩放回去再缩回来能还原位移', () => {
    const offset = { x: -35, y: 60 }
    const focal = { x: 200, y: 120 }
    const out = zoomAbout(offset, 1, 4, focal)
    const back = zoomAbout(out, 4, 1, focal)
    expect(back.x).toBeCloseTo(offset.x)
    expect(back.y).toBeCloseTo(offset.y)
  })
})

describe('rubberBand', () => {
  it('范围内原样返回', () => {
    expect(rubberBand(50, 0, 100, 1000)).toBe(50)
    expect(rubberBand(0, 0, 100, 1000)).toBe(0)
    expect(rubberBand(100, 0, 100, 1000)).toBe(100)
  })

  it('越界后越过边界但少于原始越界量', () => {
    const value = rubberBand(300, 0, 100, 1000)
    expect(value).toBeGreaterThan(100)
    expect(value).toBeLessThan(300)
  })

  it('越推越沉:越界量翻倍,增量不翻倍', () => {
    const first = rubberBand(200, 0, 100, 1000) - 100
    const second = rubberBand(300, 0, 100, 1000) - 100
    expect(second).toBeGreaterThan(first)
    expect(second).toBeLessThan(first * 2)
  })

  it('永远推不过一个跨度', () => {
    expect(rubberBand(1e9, 0, 100, 1000)).toBeLessThan(1100)
  })

  it('下界对称', () => {
    const over = rubberBand(300, 0, 100, 1000) - 100
    const under = 0 - rubberBand(-200, 0, 100, 1000)
    expect(under).toBeCloseTo(over)
  })

  it('跨度为零时退化为夹取', () => {
    expect(rubberBand(300, 0, 100, 0)).toBe(100)
    expect(rubberBand(-5, 0, 100, 0)).toBe(0)
  })

  it('系数越大阻力越小', () => {
    const stiff = rubberBand(300, 0, 100, 1000, OVERSHOOT / 2)
    const loose = rubberBand(300, 0, 100, 1000, OVERSHOOT * 2)
    expect(loose).toBeGreaterThan(stiff)
  })
})

describe('elasticOffset', () => {
  it('以舞台尺寸为跨度按轴施加阻力', () => {
    const bounds = panBounds({ width: 3000, height: 600 }, stage)
    const out = elasticOffset({ x: 1500, y: 200 }, bounds, stage)
    expect(out.x).toBeGreaterThan(1000)
    expect(out.x).toBeLessThan(1500)
    expect(out.y).toBeGreaterThan(0)
    expect(out.y).toBeLessThan(200)
  })
})

describe('elasticZoom 与 clampZoom', () => {
  it('范围内原样返回', () => {
    expect(elasticZoom(1)).toBeCloseTo(1)
    expect(elasticZoom(3)).toBeCloseTo(3)
    expect(elasticZoom(ZOOM_MAX)).toBeCloseTo(ZOOM_MAX)
  })

  it('越过上限后大于上限但小于原始倍数', () => {
    const value = elasticZoom(12)
    expect(value).toBeGreaterThan(ZOOM_MAX)
    expect(value).toBeLessThan(12)
  })

  it('低于下限后小于下限但大于原始倍数', () => {
    const value = elasticZoom(0.5)
    expect(value).toBeLessThan(ZOOM_MIN)
    expect(value).toBeGreaterThan(0.5)
  })

  it('上下越界在比例上对称', () => {
    expect(elasticZoom(12) / ZOOM_MAX).toBeCloseTo(ZOOM_MIN / elasticZoom(0.5))
  })

  it('clampZoom 夹回范围', () => {
    expect(clampZoom(12)).toBe(ZOOM_MAX)
    expect(clampZoom(0.5)).toBe(ZOOM_MIN)
    expect(clampZoom(2)).toBe(2)
  })
})

describe('pinchZoom', () => {
  it('倍数随两指距离成比例变化', () => {
    expect(pinchZoom(1, 100, 250)).toBeCloseTo(2.5)
    expect(pinchZoom(2, 200, 100)).toBeCloseTo(1)
  })

  it('起始距离为零时保持原倍数', () => {
    expect(pinchZoom(1.5, 0, 100)).toBe(1.5)
  })
})

describe('wheelZoom', () => {
  it('向下滚缩小,向上滚放大', () => {
    expect(wheelZoom(2, 100)).toBeLessThan(2)
    expect(wheelZoom(2, -100)).toBeGreaterThan(2)
  })

  it('等量正反滚动互相抵消', () => {
    expect(wheelZoom(wheelZoom(2, 120), -120)).toBeCloseTo(2)
  })
})

describe('doubleTapZoom 与 stepZoom', () => {
  it('原始大小双击放大到规格倍数,任何放大态双击回到原始', () => {
    expect(doubleTapZoom(ZOOM_MIN)).toBe(ZOOM_DOUBLE_TAP)
    expect(doubleTapZoom(ZOOM_DOUBLE_TAP)).toBe(ZOOM_MIN)
    expect(doubleTapZoom(4)).toBe(ZOOM_MIN)
  })

  it('按钮每次乘除固定步长并在边界停住', () => {
    expect(stepZoom(1, 1)).toBeCloseTo(ZOOM_STEP)
    expect(stepZoom(ZOOM_STEP, 1)).toBeCloseTo(ZOOM_STEP * ZOOM_STEP)
    expect(stepZoom(5, 1)).toBe(ZOOM_MAX)
    expect(stepZoom(1.2, -1)).toBe(ZOOM_MIN)
  })
})
