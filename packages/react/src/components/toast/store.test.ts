import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DURATION } from '../../motion'
import { toast, toastState } from './store'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  toast.dismiss()
  vi.runAllTimers()
  vi.useRealTimers()
})

describe('Toast ID 复用', () => {
  it('退出期间复用 ID 立即替换旧条目，旧清理不能删除新条目', () => {
    toast('旧消息', { id: 'same', duration: 0 })
    toast.dismiss('same')
    toast('新消息', { id: 'same', duration: 0 })
    expect(toastState.items).toHaveLength(1)
    expect(toastState.items[0]).toMatchObject({ id: 'same', message: '新消息', open: true })
    vi.runAllTimers()
    expect(toastState.items).toHaveLength(1)
    expect(toastState.items[0]?.open).toBe(true)
  })

  it('替换消息的短计时器仍能关闭消息并仅调用自己的回调', () => {
    const oldDismiss = vi.fn()
    const onAutoClose = vi.fn()
    const onDismiss = vi.fn()
    toast('旧消息', { id: 'same', duration: 0, onDismiss: oldDismiss })
    toast.dismiss('same')
    toast('新消息', { id: 'same', duration: 50, onAutoClose, onDismiss })
    vi.advanceTimersByTime(50)
    expect(toastState.items[0]?.open).toBe(false)
    expect(oldDismiss).toHaveBeenCalledOnce()
    expect(onAutoClose).toHaveBeenCalledExactlyOnceWith('same')
    expect(onDismiss).toHaveBeenCalledExactlyOnceWith('same')
    vi.runAllTimers()
    expect(toastState.items).toHaveLength(0)
  })

  it('重复替换再关闭时，新条目保留完整退出时间', () => {
    const settleDelay = (DURATION.exit + 0.06) * 1000
    toast('第一条', { id: 'same', duration: 0 })
    toast.dismiss('same')
    vi.advanceTimersByTime(100)
    toast('第二条', { id: 'same', duration: 0 })
    toast.dismiss('same')
    vi.advanceTimersByTime(100)
    toast('第三条', { id: 'same', duration: 0 })
    toast.dismiss('same')
    vi.advanceTimersByTime(settleDelay - 1)
    expect(toastState.items).toHaveLength(1)
    expect(toastState.items[0]?.message).toBe('第三条')
    vi.advanceTimersByTime(1)
    expect(toastState.items).toHaveLength(0)
  })

  it('仍打开的同 ID 消息原位更新，并重新计时', () => {
    toast('上传中', { id: 'upload', duration: 50 })
    const item = toastState.items[0]
    vi.advanceTimersByTime(25)
    toast.success('完成', { id: 'upload', duration: 100 })
    expect(toastState.items).toHaveLength(1)
    expect(toastState.items[0]).toBe(item)
    vi.advanceTimersByTime(99)
    expect(item).toMatchObject({ message: '完成', tone: 'success', open: true })
    vi.advanceTimersByTime(1)
    expect(item?.open).toBe(false)
  })
})
