import { describe, expect, it } from 'vitest'
import {
  DISMISS_COMMIT,
  DISMISS_TRAVEL,
  DISMISS_VELOCITY,
  REST_POSE,
  dismissProgress,
  fitRect,
  openPose,
  renderedRect,
  shouldDismiss,
} from './pose'

const stage = { width: 1000, height: 800 }
const natural = { width: 400, height: 200 }
const box = { x: 100, y: 100, width: 200, height: 200 }

describe('fitRect', () => {
  it('贴合后的盒子在舞台中居中', () => {
    expect(fitRect(natural, stage)).toEqual({ x: 0, y: 150, width: 1000, height: 500 })
  })
})

describe('renderedRect', () => {
  it('cover 按长边撑满盒子并居中,溢出部分伸到盒子之外', () => {
    expect(renderedRect(box, natural, 'cover')).toEqual({ x: 0, y: 100, width: 400, height: 200 })
  })

  it('contain 按短边贴合盒子并居中', () => {
    expect(renderedRect(box, natural, 'contain')).toEqual({
      x: 100,
      y: 150,
      width: 200,
      height: 100,
    })
  })

  it('fill 就是盒子本身', () => {
    expect(renderedRect(box, natural, 'fill')).toEqual(box)
  })

  it('none 保持原始像素并居中', () => {
    expect(renderedRect(box, { width: 100, height: 50 }, 'none')).toEqual({
      x: 150,
      y: 175,
      width: 100,
      height: 50,
    })
  })

  it('scale-down 在 contain 与原始像素之间取小', () => {
    expect(renderedRect(box, { width: 100, height: 50 }, 'scale-down')).toEqual(
      renderedRect(box, { width: 100, height: 50 }, 'none'),
    )
    expect(renderedRect(box, natural, 'scale-down')).toEqual(renderedRect(box, natural, 'contain'))
  })

  it('原始尺寸缺失时退化为盒子', () => {
    expect(renderedRect(box, { width: 0, height: 0 }, 'cover')).toEqual(box)
  })
})

describe('openPose', () => {
  const frame = fitRect(natural, stage)

  it('cover 缩略图:缩放到缩略图的显示比例,位移到其中心,裁掉盒子外的部分', () => {
    const pose = openPose(frame, box, natural, 'cover')
    expect(pose.scale).toBeCloseTo(0.4)
    expect(pose.x).toBeCloseTo(-300)
    expect(pose.y).toBeCloseTo(-200)
    expect(pose.clipPath).toBe('inset(0px 250px 0px 250px round 0px)')
  })

  it('缩略图的圆角按缩放比放大后写进裁切,静止姿态圆角为零', () => {
    const pose = openPose(frame, box, natural, 'cover', 8)
    expect(pose.clipPath).toBe('inset(0px 250px 0px 250px round 20px)')
    expect(REST_POSE.clipPath).toBe('inset(0px 0px 0px 0px round 0px)')
  })

  it('变换后可见区域与缩略图盒子重合', () => {
    const pose = openPose(frame, box, natural, 'cover')
    const insets = pose.clipPath.match(/[\d.]+/g)!.map(Number)
    const [top, right, bottom, left] = insets as [number, number, number, number]
    const visibleWidth = (frame.width - left - right) * pose.scale
    const visibleHeight = (frame.height - top - bottom) * pose.scale
    const centerX = frame.x + frame.width / 2 + pose.x + ((left - right) / 2) * pose.scale
    const centerY = frame.y + frame.height / 2 + pose.y + ((top - bottom) / 2) * pose.scale
    expect(visibleWidth).toBeCloseTo(box.width)
    expect(visibleHeight).toBeCloseTo(box.height)
    expect(centerX - visibleWidth / 2).toBeCloseTo(box.x)
    expect(centerY - visibleHeight / 2).toBeCloseTo(box.y)
  })

  it('contain 缩略图不裁切', () => {
    const pose = openPose(frame, box, natural, 'contain')
    expect(pose.scale).toBeCloseTo(0.2)
    expect(pose.clipPath).toBe('inset(0px 0px 0px 0px round 0px)')
  })

  it('缩略图与舞台盒子重合时是静止姿态', () => {
    const pose = openPose(frame, frame, natural, 'contain')
    expect(pose.x).toBeCloseTo(0)
    expect(pose.y).toBeCloseTo(0)
    expect(pose.scale).toBeCloseTo(1)
    expect(pose.clipPath).toBe(REST_POSE.clipPath)
  })

  it('舞台盒子为空时退回静止姿态', () => {
    expect(openPose({ x: 0, y: 0, width: 0, height: 0 }, box, natural)).toBe(REST_POSE)
  })
})

describe('dismissProgress 与 shouldDismiss', () => {
  it('向上拖不计进度,向下拖按舞台高度的比例线性到 1', () => {
    expect(dismissProgress(-100, 800)).toBe(0)
    expect(dismissProgress(0, 800)).toBe(0)
    expect(dismissProgress(800 * DISMISS_TRAVEL * 0.5, 800)).toBeCloseTo(0.5)
    expect(dismissProgress(5000, 800)).toBe(1)
  })

  it('舞台高度为零时进度为零', () => {
    expect(dismissProgress(100, 0)).toBe(0)
  })

  it('拖过提交距离或甩得够快才关闭,向上永不关闭', () => {
    const commit = 800 * DISMISS_TRAVEL * DISMISS_COMMIT
    expect(shouldDismiss(commit, 0, 800)).toBe(true)
    expect(shouldDismiss(commit - 1, 0, 800)).toBe(false)
    expect(shouldDismiss(10, DISMISS_VELOCITY, 800)).toBe(true)
    expect(shouldDismiss(10, DISMISS_VELOCITY - 1, 800)).toBe(false)
    expect(shouldDismiss(-500, 5000, 800)).toBe(false)
  })
})
