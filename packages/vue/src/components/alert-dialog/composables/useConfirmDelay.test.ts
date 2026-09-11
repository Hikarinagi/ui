import { afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createSSRApp, h, ref, type Ref } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { useConfirmDelay } from './useConfirmDelay'
import { useAlertDialogConfirm } from './useAlertDialogConfirm'

let wrapper: VueWrapper | undefined
beforeAll(() => {
  vi.useFakeTimers()
  const app = mount({ render: () => h('span') })
  vi.runOnlyPendingTimers()
  app.unmount()
  vi.useRealTimers()
})
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance'] })
})
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  vi.restoreAllMocks()
  vi.useRealTimers()
})

function countdown(initial = 3, initiallyOpen = false) {
  const open = ref(initiallyOpen)
  const seconds = ref(initial)
  let remaining!: Ref<number>
  wrapper = mount({
    setup() {
      remaining = useConfirmDelay(open, () => seconds.value)
      return () => h('span', remaining.value)
    },
  })
  return {
    open,
    seconds,
    get remaining() {
      return remaining.value
    },
  }
}

it('关闭时不计时，打开后等待足够的秒数，结束后释放计时器', () => {
  const state = countdown()
  expect(state.remaining).toBe(0)
  expect(vi.getTimerCount()).toBe(0)
  state.open.value = true
  expect(state.remaining).toBe(3)
  vi.advanceTimersByTime(1000)
  expect(state.remaining).toBe(2)
  vi.advanceTimersByTime(1999)
  expect(state.remaining).toBe(1)
  vi.advanceTimersByTime(1)
  expect(state.remaining).toBe(0)
  expect(vi.getTimerCount()).toBe(0)
})

it('初始打开也会计时，关闭保留退场文案并清理，再次打开重新开始', () => {
  const state = countdown(3, true)
  expect(state.remaining).toBe(3)
  vi.advanceTimersByTime(1000)
  state.open.value = false
  expect(state.remaining).toBe(2)
  expect(vi.getTimerCount()).toBe(0)
  vi.advanceTimersByTime(5000)
  state.open.value = true
  expect(state.remaining).toBe(3)
  vi.advanceTimersByTime(1000)
  expect(state.remaining).toBe(2)
})

it('打开期间修改延迟重新计时，改为零立即解除', () => {
  const state = countdown(3, true)
  vi.advanceTimersByTime(1000)
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
  vi.advanceTimersByTime(1999)
  expect(state.remaining).toBe(1)
  vi.advanceTimersByTime(1)
  expect(state.remaining).toBe(0)
})

it('回调延迟执行时按实际经过时间更新，避免累计漂移', () => {
  const state = countdown(3, true)
  vi.spyOn(performance, 'now').mockReturnValue(3500)
  vi.advanceTimersByTime(1000)
  expect(state.remaining).toBe(0)
  expect(vi.getTimerCount()).toBe(0)
})

it('卸载清理未完成的计时器', () => {
  countdown(3, true)
  expect(vi.getTimerCount()).toBe(1)
  wrapper!.unmount()
  wrapper = undefined
  expect(vi.getTimerCount()).toBe(0)
})

it('SSR 初始值一致，服务端不启动计时器', async () => {
  const app = createSSRApp({
    setup() {
      const remaining = useConfirmDelay(ref(true), () => 3)
      return () => h('span', remaining.value)
    },
  })
  const schedule = vi.spyOn(globalThis, 'setTimeout')
  const html = renderToString(app)
  expect(schedule).not.toHaveBeenCalled()
  expect(await html).toBe('<span>3</span>')
})

it('确认入口也检查倒计时，到期前不执行，到期后不会自动执行', async () => {
  const open = ref(true)
  const onConfirm = vi.fn()
  let confirm!: () => Promise<void>
  wrapper = mount({
    setup() {
      const remaining = useConfirmDelay(open, () => 2)
      ;({ confirm } = useAlertDialogConfirm(
        { onConfirm },
        open,
        vi.fn(),
        () => remaining.value > 0,
      ))
      return () => h('span')
    },
  })
  await confirm()
  expect(onConfirm).not.toHaveBeenCalled()
  expect(open.value).toBe(true)
  vi.advanceTimersByTime(2000)
  expect(onConfirm).not.toHaveBeenCalled()
  await confirm()
  expect(onConfirm).toHaveBeenCalledOnce()
  expect(open.value).toBe(false)
  await confirm()
  expect(onConfirm).toHaveBeenCalledOnce()
})
