import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import DateTimePicker from './DateTimePicker.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

const dayOf = (date: string) =>
  document.querySelector(`[data-hn-calendar] [data-value="${date}"]`) as HTMLElement
const popoverSpins = () =>
  Array.from(
    document.querySelectorAll('[data-hn-date-time-picker-time] [role="spinbutton"]'),
  ) as HTMLElement[]

function mountPicker(modelValue: string | null, extra: Record<string, unknown> = {}) {
  const w = mount(DateTimePicker, {
    props: {
      modelValue,
      ...extra,
      'onUpdate:modelValue': (value: string | null) => w.setProps({ modelValue: value }),
      'onUpdate:open': (value: boolean) => w.setProps({ open: value }),
    },
    attrs: { 'aria-label': '发布时间' },
    attachTo: document.body,
  })
  return w
}

describe('结构', () => {
  it('宿主是输入面，里面是到分的日期段与打开按钮；attrs 落在段的组元素上', () => {
    const w = mountPicker('2026-09-04T20:30', { class: 'w-80' })
    const host = w.find('[data-hn-date-time-picker]')
    expect(host.classes()).toContain('hn-field')
    expect(host.classes()).toContain('w-80')
    expect(w.find('[data-hn-date-field]').classes()).not.toContain('hn-field')
    expect(w.find('[role="group"]').attributes('aria-label')).toBe('发布时间')
    expect(w.findAll('[role="spinbutton"]').map(s => s.attributes('aria-valuenow'))).toEqual([
      '2026',
      '9',
      '4',
      '20',
      '30',
    ])
    expect(w.find('button[aria-label="打开日历"]').attributes('aria-expanded')).toBe('false')
  })

  it('granularity 为 second 时段与值都到秒', () => {
    const w = mountPicker('2026-09-04T20:30:15', { granularity: 'second' })
    expect(w.findAll('[role="spinbutton"]')).toHaveLength(6)
  })
})

describe('交互', () => {
  it('打开后选一天：日期写回、时间沿用原值、浮层保持打开；改浮层里的时间段即写回；确定关闭', async () => {
    const w = mountPicker('2026-09-04T20:30')
    await w.find('button[aria-label="打开日历"]').trigger('click')
    await nextTick()
    expect(w.emitted('update:open')?.[0]).toEqual([true])
    dayOf('2026-09-10').click()
    await nextTick()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['2026-09-10T20:30'])
    expect(w.emitted('update:open')).toHaveLength(1)
    const time = document.querySelector('[data-hn-calendar] ~ div [data-hn-time-field]')
    expect(time).not.toBeNull()
    const minute = time!.querySelectorAll('[role="spinbutton"]')[1] as HTMLElement
    minute.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
    await nextTick()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['2026-09-10T20:31'])
    const done = Array.from(document.querySelectorAll('button')).find(
      b => b.textContent?.trim() === '确定',
    )!
    done.click()
    await nextTick()
    expect(w.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('空值时选一天，时间取占位的时间部分，没有占位则取零点', async () => {
    const plain = mountPicker(null, { placeholder: '2026-09-01T09:00' })
    await plain.find('button[aria-label="打开日历"]').trigger('click')
    await nextTick()
    dayOf('2026-09-10').click()
    await nextTick()
    expect(plain.emitted('update:modelValue')?.at(-1)).toEqual(['2026-09-10T09:00'])
    plain.unmount()
    document.body.innerHTML = ''
    const bare = mountPicker(null, { placeholder: '2026-09-01' })
    await bare.find('button[aria-label="打开日历"]').trigger('click')
    await nextTick()
    dayOf('2026-09-10').click()
    await nextTick()
    expect(bare.emitted('update:modelValue')?.at(-1)).toEqual(['2026-09-10T00:00'])
  })

  it('清除钮清空值并发 clear，日历不打开', async () => {
    const w = mountPicker('2026-09-04T20:30', { clearable: true })
    await w.find('button[aria-label="清除"]').trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual([null])
    expect(w.emitted('clear')).toHaveLength(1)
    expect(w.emitted('update:open')).toBeUndefined()
    expect(popoverSpins()).toHaveLength(0)
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mountPicker('2026-09-04T20:30', { clearable: true })
    await expectNoA11yViolations(w.element)
  })
})
