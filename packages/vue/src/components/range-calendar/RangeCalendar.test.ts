import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import RangeCalendar from './RangeCalendar.vue'
import type { DateRangeValue } from '../../lib/date'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

const dayOf = (w: ReturnType<typeof mount>, date: string) =>
  w.find(`[data-reka-calendar-cell-trigger][data-value="${date}"]`)

function mountRange(modelValue: DateRangeValue | null, extra: Record<string, unknown> = {}) {
  const w = mount(RangeCalendar, {
    props: {
      modelValue,
      ...extra,
      'onUpdate:modelValue': (value: DateRangeValue | null) => w.setProps({ modelValue: value }),
    },
    attachTo: document.body,
  })
  return w
}

describe('结构', () => {
  it('根带语言包名称与当前月份，固定六周共 42 格，翻页按钮与标题同 Calendar', () => {
    const w = mountRange({ start: '2026-09-04', end: '2026-09-10' })
    expect(w.find('[data-hn-range-calendar]').attributes('aria-label')).toBe('日历, 2026年9月')
    expect(w.findAll('[data-reka-calendar-cell-trigger]')).toHaveLength(42)
    expect(w.find('button[aria-label="上个月"]').exists()).toBe(true)
    expect(w.find('button[aria-label="选择月份"]').text()).toBe('2026年9月')
  })

  it('v-model 是 { start, end }：区间内的格都带 data-selected，两端另带起止标记；点两格交出新区间', async () => {
    const w = mountRange({ start: '2026-09-04', end: '2026-09-10' })
    expect(dayOf(w, '2026-09-04').attributes('data-selection-start')).toBe('true')
    expect(dayOf(w, '2026-09-10').attributes('data-selection-end')).toBe('true')
    expect(dayOf(w, '2026-09-07').attributes('data-selected')).toBe('true')
    expect(dayOf(w, '2026-09-07').attributes('data-selection-start')).toBeUndefined()
    expect(dayOf(w, '2026-09-11').attributes('data-selected')).toBeUndefined()
    await dayOf(w, '2026-09-20').trigger('click')
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([{ start: '2026-09-20', end: null }])
    await dayOf(w, '2026-09-25').trigger('mouseenter')
    await dayOf(w, '2026-09-25').trigger('click')
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([
      { start: '2026-09-20', end: '2026-09-25' },
    ])
    expect(dayOf(w, '2026-09-22').attributes('data-selected')).toBe('true')
  })

  it('min 与 max 之外的格禁用，unavailable 以 ISO 字符串判定', () => {
    const w = mountRange(null, {
      placeholder: '2026-09-01',
      min: '2026-09-07',
      max: '2026-09-25',
      unavailable: (date: string) => date === '2026-09-13',
    })
    expect(dayOf(w, '2026-09-06').attributes('data-disabled')).toBe('')
    expect(dayOf(w, '2026-09-26').attributes('data-disabled')).toBe('')
    expect(dayOf(w, '2026-09-13').attributes('data-unavailable')).toBe('')
    expect(dayOf(w, '2026-09-14').attributes('data-disabled')).toBeUndefined()
  })

  it('maximumDays 在选定开始日期后禁用超出天数的日期，区间完成后解除', () => {
    const pending = mountRange({ start: '2026-09-08', end: null }, { maximumDays: 7 })
    expect(dayOf(pending, '2026-09-14').attributes('data-disabled')).toBeUndefined()
    expect(dayOf(pending, '2026-09-15').attributes('data-disabled')).toBe('')
    expect(dayOf(pending, '2026-09-02').attributes('data-disabled')).toBeUndefined()
    expect(dayOf(pending, '2026-09-01').attributes('data-disabled')).toBe('')
    const done = mountRange({ start: '2026-09-08', end: '2026-09-10' }, { maximumDays: 7 })
    expect(done.find('[data-reka-calendar-cell-trigger][data-disabled]').exists()).toBe(false)
  })

  it('readonly 时点击不改值；disabled 落在根上', async () => {
    const still = mountRange({ start: '2026-09-04', end: '2026-09-10' }, { readonly: true })
    await dayOf(still, '2026-09-20').trigger('click')
    await dayOf(still, '2026-09-25').trigger('click')
    expect(still.emitted('update:modelValue')).toBeUndefined()
    const off = mountRange(null, { placeholder: '2026-09-01', disabled: true })
    expect(off.find('[data-hn-range-calendar]').attributes('data-disabled')).toBe('')
  })
})

describe('服务端渲染', () => {
  it('首屏渲染出整月网格与区间', async () => {
    const html = await renderToString(
      createSSRApp(
        defineComponent({
          render: () =>
            h(RangeCalendar, { modelValue: { start: '2026-09-04', end: '2026-09-10' } }),
        }),
      ),
    )
    expect(html.match(/role="gridcell"/g)).toHaveLength(42)
    expect(html.match(/data-selected="true"/g)).toHaveLength(7)
    expect(html).toContain('data-selection-start="true"')
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mountRange({ start: '2026-09-04', end: '2026-09-10' })
    await expectNoA11yViolations(w.element)
  })
})
