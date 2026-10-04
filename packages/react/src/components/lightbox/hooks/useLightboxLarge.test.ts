import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, renderHook } from '@testing-library/react'
import { LARGE_HINT_DELAY_MS, useLightboxLarge } from './useLightboxLarge'
import type { LightboxItem } from '../types'

let decoders: Array<{ resolve: () => void; reject: () => void; src: string }> = []

beforeEach(() => {
  vi.useFakeTimers()
  decoders = []
  vi.stubGlobal(
    'Image',
    class {
      decoding = ''
      src = ''
      decode() {
        return new Promise<void>((resolve, reject) => {
          decoders.push({ resolve, reject, src: this.src })
        })
      }
    },
  )
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

function harness(item: LightboxItem) {
  const view = renderHook(
    ({ current, active }: { current: LightboxItem | undefined; active: boolean }) =>
      useLightboxLarge(current, active),
    { initialProps: { current: item as LightboxItem | undefined, active: true } },
  )
  return {
    current: {
      set value(next: LightboxItem | undefined) {
        view.rerender({ current: next, active: true })
      },
    },
    state: () => view.result.current,
  }
}

async function nextTick() {
  await act(async () => {})
}

describe('useLightboxLarge', () => {
  it('大图与小图同址时不加载', () => {
    const { state } = harness({ id: 'a', src: '/a', preview: '/a', alt: '' })
    expect(state().src).toBeUndefined()
    expect(decoders).toHaveLength(0)
  })

  it('迟迟不到才显示提示,到位后提示收起并接替', async () => {
    const { state } = harness({ id: 'a', src: '/a', preview: '/a-large', alt: '' })
    expect(decoders).toHaveLength(1)
    expect(state().waiting).toBe(false)
    act(() => vi.advanceTimersByTime(LARGE_HINT_DELAY_MS - 1))
    expect(state().waiting).toBe(false)
    act(() => vi.advanceTimersByTime(1))
    expect(state().waiting).toBe(true)
    decoders[0]!.resolve()
    await nextTick()
    await nextTick()
    expect(state().waiting).toBe(false)
    expect(state().ready).toBe(true)
    expect(state().src).toBe('/a-large')
  })

  it('到位够快就不出提示', async () => {
    const { state } = harness({ id: 'a', src: '/a', preview: '/a-large', alt: '' })
    decoders[0]!.resolve()
    await nextTick()
    await nextTick()
    act(() => vi.advanceTimersByTime(LARGE_HINT_DELAY_MS))
    expect(state().waiting).toBe(false)
    expect(state().ready).toBe(true)
  })

  it('切换图片时放弃上一张,失败时静默停在小图', async () => {
    const { current, state } = harness({ id: 'a', src: '/a', preview: '/a-large', alt: '' })
    current.value = { id: 'b', src: '/b', preview: '/b-large', alt: '' }
    await nextTick()
    expect(decoders).toHaveLength(2)
    decoders[0]!.resolve()
    await nextTick()
    await nextTick()
    expect(state().ready).toBe(false)
    expect(state().src).toBe('/b-large')
    decoders[1]!.reject()
    await nextTick()
    await nextTick()
    expect(state().ready).toBe(false)
    expect(state().waiting).toBe(false)
  })
})
