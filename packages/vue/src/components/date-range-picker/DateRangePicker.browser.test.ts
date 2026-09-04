import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, reactive } from 'vue'
import DateRangePicker from './DateRangePicker.vue'
import DatePicker from '../date-picker/DatePicker.vue'
import type { DateRangeValue } from '../../lib/date'
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
  host.style.cssText = 'width: 480px; padding: 40px'
  document.body.appendChild(host)
  return host
}

function mountPicker(props: Record<string, unknown> = {}) {
  const state = reactive<{ modelValue: DateRangeValue | null; open: boolean }>({
    modelValue: { start: '2026-09-04', end: '2026-09-10' },
    open: false,
  })
  const w = mount(
    defineComponent({
      render: () =>
        h(DateRangePicker, {
          ...state,
          ...props,
          'aria-label': '活动期间',
          'onUpdate:modelValue': (value: DateRangeValue | null) => (state.modelValue = value),
          'onUpdate:open': (value: boolean) => (state.open = value),
        }),
    }),
    { attachTo: attach(), global: { stubs: { transition: false } } },
  )
  mounted.push(w)
  const host = w.find('[data-hn-date-range-picker]').element as HTMLElement
  return {
    state,
    host,
    toggle: host.querySelector('button[aria-label="打开日历"]') as HTMLButtonElement,
    calendar: () => document.querySelector('[data-hn-range-calendar]') as HTMLElement | null,
  }
}

describe('date-range-picker · 打开与选择', () => {
  it('点按钮打开，焦点落在区间的起点；键盘选出新区间后关闭并把焦点还给按钮；日历左缘与输入面左缘对齐', async () => {
    const { state, host, toggle, calendar } = mountPicker()
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
    await vi.waitFor(() => expect(state.modelValue).toEqual({ start: '2026-09-05', end: null }))
    expect(calendar()).not.toBeNull()
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{Enter}')
    await vi.waitFor(() =>
      expect(state.modelValue).toEqual({ start: '2026-09-05', end: '2026-09-07' }),
    )
    await vi.waitFor(() => expect(calendar()).toBeNull())
    expect(document.activeElement).toBe(toggle)
    expect(document.body.style.overflow).toBe('')
  })

  it('日历是模态浮层：打开期间点输入面即关闭；Esc 关闭并把焦点还给按钮', async () => {
    const { host, toggle, calendar } = mountPicker()
    await userEvent.click(toggle)
    await vi.waitFor(() => expect(calendar()).not.toBeNull())
    await userEvent.click(host.querySelector('[data-hn-segment]')!, { force: true })
    await vi.waitFor(() => expect(calendar()).toBeNull())
    await userEvent.click(toggle)
    await vi.waitFor(() => expect(calendar()).not.toBeNull())
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(calendar()).toBeNull())
    expect(document.activeElement).toBe(toggle)
  })

  it('三档宿主高度与 DatePicker 逐档相等，浮层里的日历同档', async () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const single = mount(DatePicker, {
        props: { size, modelValue: '2026-09-04' },
        attrs: { 'aria-label': size },
        attachTo: attach(),
      })
      mounted.push(single)
      const { host, toggle, calendar } = mountPicker({ size })
      expect(host.offsetHeight).toBe(
        (single.element.querySelector('[data-hn-date-picker]') as HTMLElement).offsetHeight,
      )
      await userEvent.click(toggle)
      await vi.waitFor(() => expect(calendar()).not.toBeNull())
      const cell = calendar()!.querySelector('[data-value="2026-09-04"]') as HTMLElement
      const raw = getComputedStyle(cell).getPropertyValue(`--hn-control-h-${size}`).trim()
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
      expect(cell.offsetHeight).toBe(raw.endsWith('rem') ? parseFloat(raw) * rem : parseFloat(raw))
      await userEvent.keyboard('{Escape}')
      await vi.waitFor(() => expect(calendar()).toBeNull())
    }
  })
})
