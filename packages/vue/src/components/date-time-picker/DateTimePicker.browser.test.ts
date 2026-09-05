import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, reactive } from 'vue'
import DateTimePicker from './DateTimePicker.vue'
import DatePicker from '../date-picker/DatePicker.vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function attach() {
  const host = document.createElement('div')
  host.style.cssText = 'width: 420px; padding: 40px'
  document.body.appendChild(host)
  return host
}

function mountPicker(props: Record<string, unknown> = {}) {
  const state = reactive<{ modelValue: string | null; open: boolean }>({
    modelValue: '2026-09-04T20:30',
    open: false,
  })
  const w = mount(
    defineComponent({
      render: () =>
        h(DateTimePicker, {
          ...state,
          ...props,
          'aria-label': '发布时间',
          'onUpdate:modelValue': (value: string | null) => (state.modelValue = value),
          'onUpdate:open': (value: boolean) => (state.open = value),
        }),
    }),
    { attachTo: attach(), global: { stubs: { transition: false } } },
  )
  mounted.push(w)
  const host = w.find('[data-hn-date-time-picker]').element as HTMLElement
  return {
    state,
    host,
    toggle: host.querySelector('button[aria-label="打开日历"]') as HTMLButtonElement,
    calendar: () => document.querySelector('[data-hn-calendar]') as HTMLElement | null,
    time: () =>
      document.querySelector('[role="dialog"] [data-hn-time-field]') as HTMLElement | null,
  }
}

describe('date-time-picker · 打开与选择', () => {
  it('点按钮打开，焦点落在选中的日；选一天后浮层仍开着；在时间段里键入即写回；确定关闭并把焦点还给按钮', async () => {
    const { state, host, toggle, calendar, time } = mountPicker()
    await userEvent.click(toggle)
    await vi.waitFor(() => expect(calendar()).not.toBeNull())
    expect(document.body.style.overflow).toBe('hidden')
    await vi.waitFor(() =>
      expect(document.activeElement).toBe(calendar()!.querySelector('[data-value="2026-09-04"]')),
    )
    await vi.waitFor(() =>
      expect(
        Math.abs(
          calendar()!.closest('[role="dialog"]')!.getBoundingClientRect().left -
            host.getBoundingClientRect().left,
        ),
      ).toBeLessThan(1),
    )
    await userEvent.keyboard('{ArrowRight}{Enter}')
    await vi.waitFor(() => expect(state.modelValue).toBe('2026-09-05T20:30'))
    expect(calendar()).not.toBeNull()
    const hour = time()!.querySelector('[role="spinbutton"]') as HTMLElement
    await userEvent.click(hour)
    await userEvent.keyboard('0915')
    await vi.waitFor(() => expect(state.modelValue).toBe('2026-09-05T09:15'))
    const done = Array.from(document.querySelectorAll('[role="dialog"] button')).find(
      b => b.textContent?.trim() === '确定',
    ) as HTMLElement
    await userEvent.click(done)
    await vi.waitFor(() => expect(calendar()).toBeNull())
    expect(document.activeElement).toBe(toggle)
    expect(document.body.style.overflow).toBe('')
  })

  it('三档宿主高度与 DatePicker 逐档相等，浮层里的时间段与日历同档', async () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const single = mount(DatePicker, {
        props: { size, modelValue: '2026-09-04' },
        attrs: { 'aria-label': size },
        attachTo: attach(),
      })
      mounted.push(single)
      const { host, toggle, calendar, time } = mountPicker({ size })
      expect(host.offsetHeight).toBe(
        (single.element.querySelector('[data-hn-date-picker]') as HTMLElement).offsetHeight,
      )
      await userEvent.click(toggle)
      await vi.waitFor(() => expect(calendar()).not.toBeNull())
      const cell = calendar()!.querySelector('[data-value="2026-09-04"]') as HTMLElement
      expect(time()!.offsetHeight).toBe(cell.offsetHeight)
      await userEvent.keyboard('{Escape}')
      await vi.waitFor(() => expect(calendar()).toBeNull())
    }
  })
})
