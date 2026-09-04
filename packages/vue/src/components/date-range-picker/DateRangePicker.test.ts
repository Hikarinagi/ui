import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import DateRangePicker from './DateRangePicker.vue'
import type { DateRangeValue } from '../../lib/date'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

const range = { start: '2026-09-04', end: '2026-09-10' }

const dayOf = (date: string) =>
  document.querySelector(`[data-hn-range-calendar] [data-value="${date}"]`) as HTMLElement

describe('结构', () => {
  it('宿主是输入面，里面是嵌入的起止日期段与打开日历的按钮；attrs 落在段的组元素上', () => {
    const w = mount(DateRangePicker, {
      props: { modelValue: range, class: 'w-96' },
      attrs: { 'aria-label': '活动期间' },
    })
    const host = w.find('[data-hn-date-range-picker]')
    expect(host.classes()).toContain('hn-field')
    expect(host.classes()).toContain('w-96')
    expect(w.find('[data-hn-date-range-field]').classes()).not.toContain('hn-field')
    expect(w.find('[role="group"]').attributes('aria-label')).toBe('活动期间')
    expect(w.findAll('[role="spinbutton"]').map(s => s.attributes('aria-valuenow'))).toEqual([
      '2026',
      '9',
      '4',
      '2026',
      '9',
      '10',
    ])
    expect(w.find('button[aria-label="打开日历"]').attributes('aria-expanded')).toBe('false')
  })

  it('disabled 与 invalid 落在宿主并传给段与按钮', () => {
    const w = mount(DateRangePicker, {
      props: { modelValue: range, disabled: true, invalid: true },
    })
    expect(w.find('[data-hn-date-range-picker]').attributes('data-invalid')).toBe('')
    expect(w.find('button[aria-label="打开日历"]').attributes('disabled')).toBeDefined()
    expect(w.find('[role="group"]').attributes('aria-invalid')).toBe('true')
    expect(w.findAll('[role="spinbutton"]').every(s => s.attributes('data-disabled') === '')).toBe(
      true,
    )
  })
})

describe('交互', () => {
  it('点按钮打开日历，选起点后浮层保持打开，选终点后写回并关闭；v-model:open 同步', async () => {
    const w = mount(DateRangePicker, {
      props: {
        modelValue: range,
        'onUpdate:modelValue': (value: DateRangeValue | null) => w.setProps({ modelValue: value }),
        'onUpdate:open': (value: boolean) => w.setProps({ open: value }),
      },
      attachTo: document.body,
    })
    await w.find('button[aria-label="打开日历"]').trigger('click')
    await nextTick()
    expect(w.emitted('update:open')?.[0]).toEqual([true])
    expect(dayOf('2026-09-07').getAttribute('data-selected')).toBe('true')
    dayOf('2026-09-20').click()
    await nextTick()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([{ start: '2026-09-20', end: null }])
    expect(w.emitted('update:open')).toHaveLength(1)
    dayOf('2026-09-25').dispatchEvent(new MouseEvent('mouseenter'))
    dayOf('2026-09-25').click()
    await nextTick()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([
      { start: '2026-09-20', end: '2026-09-25' },
    ])
    expect(w.emitted('update:open')?.[1]).toEqual([false])
  })

  it('清除钮清空值并发 clear，日历不打开', async () => {
    const w = mount(DateRangePicker, {
      props: { modelValue: range, clearable: true },
      attachTo: document.body,
    })
    await w.find('button[aria-label="清除"]').trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual([null])
    expect(w.emitted('clear')).toHaveLength(1)
    expect(w.emitted('update:open')).toBeUndefined()
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mount(DateRangePicker, {
      props: { modelValue: range, clearable: true },
      attrs: { 'aria-label': '活动期间' },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element)
  })
})
