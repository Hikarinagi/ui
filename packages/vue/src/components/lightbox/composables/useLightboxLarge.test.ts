import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, shallowRef } from 'vue'
import { mount } from '@vue/test-utils'
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
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

function harness(item: LightboxItem) {
  const current = shallowRef<LightboxItem | undefined>(item)
  const active = shallowRef(true)
  let state!: ReturnType<typeof useLightboxLarge>
  const w = mount(
    defineComponent({
      setup() {
        state = useLightboxLarge(
          () => current.value,
          () => active.value,
        )
        return () => h('span')
      },
    }),
  )
  return { w, current, active, state: () => state }
}

describe('useLightboxLarge', () => {
  it('大图与小图同址时不加载', () => {
    const { state } = harness({ id: 'a', src: '/a', preview: '/a', alt: '' })
    expect(state().src.value).toBeUndefined()
    expect(decoders).toHaveLength(0)
  })

  it('迟迟不到才显示提示,到位后提示收起并接替', async () => {
    const { state } = harness({ id: 'a', src: '/a', preview: '/a-large', alt: '' })
    expect(decoders).toHaveLength(1)
    expect(state().waiting.value).toBe(false)
    vi.advanceTimersByTime(LARGE_HINT_DELAY_MS - 1)
    expect(state().waiting.value).toBe(false)
    vi.advanceTimersByTime(1)
    expect(state().waiting.value).toBe(true)
    decoders[0]!.resolve()
    await nextTick()
    await nextTick()
    expect(state().waiting.value).toBe(false)
    expect(state().ready.value).toBe(true)
    expect(state().src.value).toBe('/a-large')
  })

  it('到位够快就不出提示', async () => {
    const { state } = harness({ id: 'a', src: '/a', preview: '/a-large', alt: '' })
    decoders[0]!.resolve()
    await nextTick()
    await nextTick()
    vi.advanceTimersByTime(LARGE_HINT_DELAY_MS)
    expect(state().waiting.value).toBe(false)
    expect(state().ready.value).toBe(true)
  })

  it('切换图片时放弃上一张,失败时静默停在小图', async () => {
    const { current, state } = harness({ id: 'a', src: '/a', preview: '/a-large', alt: '' })
    current.value = { id: 'b', src: '/b', preview: '/b-large', alt: '' }
    await nextTick()
    expect(decoders).toHaveLength(2)
    decoders[0]!.resolve()
    await nextTick()
    await nextTick()
    expect(state().ready.value).toBe(false)
    expect(state().src.value).toBe('/b-large')
    decoders[1]!.reject()
    await nextTick()
    await nextTick()
    expect(state().ready.value).toBe(false)
    expect(state().waiting.value).toBe(false)
  })
})
