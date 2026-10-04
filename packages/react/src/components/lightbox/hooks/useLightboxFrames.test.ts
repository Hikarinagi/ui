import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { cleanup, renderHook } from '@testing-library/react'
import { useLightboxFrames } from './useLightboxFrames'
import type { LightboxItem } from '../types'

function decoded(src: string, width: number, height: number) {
  const img = document.createElement('img')
  img.src = src
  Object.defineProperties(img, {
    naturalWidth: { value: width },
    naturalHeight: { value: height },
  })
  img.decode = vi.fn().mockResolvedValue(undefined)
  return img
}

beforeEach(() => {
  vi.stubGlobal(
    'Image',
    vi.fn(function () {
      return decoded('', 320, 180)
    }),
  )
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

function harness(items: LightboxItem[]) {
  const current = { value: items }
  const { result } = renderHook(() => useLightboxFrames(() => current.value))
  return { current, frames: result.current }
}

it('显式尺寸在加载前可用,小图与高清图解码后都不覆盖它', () => {
  const item: LightboxItem = {
    id: 'a',
    src: '/small.webp',
    preview: '/large.webp',
    previewSize: { width: 1800, height: 1200 },
    alt: '',
  }
  const { frames } = harness([item])
  expect(frames.read(() => item)).toBeUndefined()
  expect(Image).not.toHaveBeenCalled()
  expect(frames.displayOf(item)).toEqual(item.previewSize)
  frames.learn(item.id, decoded(item.src, 320, 180))
  frames.learnPreview(item, decoded(item.preview!, 1920, 1080))
  expect(frames.naturalOf(item)).toMatchObject({ width: 320, height: 180 })
  expect(frames.displayOf(item)).toEqual(item.previewSize)
  expect(frames.displayOf({ ...item, previewSize: undefined })).toMatchObject({
    width: 1920,
    height: 1080,
  })
})

it.each([
  { width: 0, height: 1080 },
  { width: 1920, height: -1 },
  { width: Number.NaN, height: 1080 },
  { width: 1920, height: Number.POSITIVE_INFINITY },
  { width: undefined, height: 1080 },
  { width: 1920, height: undefined },
])('无效尺寸 $width × $height 使用正常加载结果', async size => {
  const item: LightboxItem = {
    id: 'a',
    src: '/small.webp',
    preview: '/large.webp',
    previewSize: size as LightboxItem['previewSize'],
    alt: '',
  }
  const { frames } = harness([item])
  expect(frames.displayOf(item)).toBeUndefined()
  await frames.read(() => item)
  expect(Image).toHaveBeenCalledOnce()
  expect(frames.displayOf(item)).toMatchObject({ width: 320, height: 180 })
  frames.learnPreview(item, decoded(item.preview!, 1920, 1080))
  expect(frames.displayOf(item)).toMatchObject({ width: 1920, height: 1080 })
})

it('尺寸随条目读取,同 id 换图或移除元数据不会沿用旧尺寸', () => {
  const first: LightboxItem = {
    id: 'same',
    src: '/first.webp',
    previewSize: { width: 1920, height: 1080 },
    alt: '',
  }
  const second: LightboxItem = {
    id: 'same',
    src: '/second.webp',
    previewSize: { width: 600, height: 900 },
    alt: '',
  }
  const { current, frames } = harness([first])
  expect(frames.displayOf(current.value[0])).toEqual(first.previewSize)
  current.value = [second]
  expect(frames.displayOf(current.value[0])).toEqual(second.previewSize)
  current.value = [{ ...second, previewSize: undefined }]
  expect(frames.displayOf(current.value[0])).toBeUndefined()
})
