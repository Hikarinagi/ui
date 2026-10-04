import { act, render, cleanup } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { useConfirmDelay } from './useConfirmDelay'
import { useAlertDialogConfirm } from './useAlertDialogConfirm'
import { signal } from '../../../../test/signal'

let unmount: (() => void) | undefined
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance'] })
})
afterEach(() => {
  unmount?.()
  unmount = undefined
  cleanup()
  vi.restoreAllMocks()
  vi.useRealTimers()
})

function countdown(initial = 3, initiallyOpen = false) {
  const open = signal(initiallyOpen)
  const seconds = signal(initial)
  let remaining = 0
  function Probe() {
    remaining = useConfirmDelay(open.use(), seconds.use())
    return <span>{remaining}</span>
  }
  ;({ unmount } = render(<Probe />))
  return {
    open: {
      set value(value: boolean) {
        act(() => {
          open.value = value
        })
      },
    },
    seconds: {
      set value(value: number) {
        act(() => {
          seconds.value = value
        })
      },
    },
    get remaining() {
      return remaining
    },
  }
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms)
  })
}

it('关闭时不计时，打开后等待足够的秒数，结束后释放计时器', () => {
  const state = countdown()
  expect(state.remaining).toBe(0)
  expect(vi.getTimerCount()).toBe(0)
  state.open.value = true
  expect(state.remaining).toBe(3)
  advance(1000)
  expect(state.remaining).toBe(2)
  advance(1999)
  expect(state.remaining).toBe(1)
  advance(1)
  expect(state.remaining).toBe(0)
  expect(vi.getTimerCount()).toBe(0)
})

it('初始打开也会计时，关闭保留退场文案并清理，再次打开重新开始', () => {
  const state = countdown(3, true)
  expect(state.remaining).toBe(3)
  advance(1000)
  state.open.value = false
  expect(state.remaining).toBe(2)
  expect(vi.getTimerCount()).toBe(0)
  advance(5000)
  state.open.value = true
  expect(state.remaining).toBe(3)
  advance(1000)
  expect(state.remaining).toBe(2)
})

it('打开期间修改延迟重新计时，改为零立即解除', () => {
  const state = countdown(3, true)
  advance(1000)
  state.seconds.value = 5
  expect(state.remaining).toBe(5)
  expect(vi.getTimerCount()).toBe(1)
  state.seconds.value = 0
  expect(state.remaining).toBe(0)
  expect(vi.getTimerCount()).toBe(0)
})

it.each([0, -1, NaN, Infinity, -Infinity])('%s 不启动倒计时', value => {
  const state = countdown(value, true)
  expect(state.remaining).toBe(0)
  expect(vi.getTimerCount()).toBe(0)
})

it('小数向上取整，不能提前解锁', () => {
  const state = countdown(1.2, true)
  expect(state.remaining).toBe(2)
  advance(1999)
  expect(state.remaining).toBe(1)
  advance(1)
  expect(state.remaining).toBe(0)
})

it('回调延迟执行时按实际经过时间更新，避免累计漂移', () => {
  const state = countdown(3, true)
  vi.spyOn(performance, 'now').mockReturnValue(3500)
  advance(1000)
  expect(state.remaining).toBe(0)
  expect(vi.getTimerCount()).toBe(0)
})

it('卸载清理未完成的计时器', () => {
  countdown(3, true)
  expect(vi.getTimerCount()).toBe(1)
  unmount!()
  unmount = undefined
  expect(vi.getTimerCount()).toBe(0)
})

it('SSR 初始值一致，服务端不启动计时器', () => {
  function Probe() {
    const remaining = useConfirmDelay(true, 3)
    return <span>{remaining}</span>
  }
  const schedule = vi.spyOn(globalThis, 'setTimeout')
  const html = renderToString(<Probe />)
  expect(schedule).not.toHaveBeenCalled()
  expect(html).toBe('<span>3</span>')
})

it('确认入口也检查倒计时，到期前不执行，到期后不会自动执行', async () => {
  const open = signal(true)
  const onConfirm = vi.fn()
  let confirm!: () => Promise<void>
  function Probe() {
    const value = open.use()
    const remaining = useConfirmDelay(value, 2)
    ;({ confirm } = useAlertDialogConfirm(
      { onConfirm },
      value,
      next => {
        open.value = next
      },
      vi.fn(),
      () => remaining > 0,
    ))
    return <span />
  }
  ;({ unmount } = render(<Probe />))
  await act(() => confirm())
  expect(onConfirm).not.toHaveBeenCalled()
  expect(open.value).toBe(true)
  advance(2000)
  expect(onConfirm).not.toHaveBeenCalled()
  await act(() => confirm())
  expect(onConfirm).toHaveBeenCalledOnce()
  expect(open.value).toBe(false)
  await act(() => confirm())
  expect(onConfirm).toHaveBeenCalledOnce()
})
