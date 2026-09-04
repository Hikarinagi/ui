import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import DatePicker from './DatePicker.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('结构', () => {
  it('宿主是输入面，里面是嵌入的日期段与打开日历的按钮；attrs 落在段的组元素上', () => {
    const w = mount(DatePicker, {
      props: { modelValue: '2026-09-04', class: 'w-72' },
      attrs: { 'aria-label': '发布日期' },
    })
    const host = w.find('[data-hn-date-picker]')
    expect(host.classes()).toContain('hn-field')
    expect(host.classes()).toContain('w-72')
    expect(w.find('[data-hn-date-field]').classes()).not.toContain('hn-field')
    expect(w.find('[role="group"]').attributes('aria-label')).toBe('发布日期')
    expect(w.findAll('[role="spinbutton"]').map(s => s.attributes('aria-valuenow'))).toEqual([
      '2026',
      '9',
      '4',
    ])
    const toggle = w.find('button[aria-label="打开日历"]')
    expect(toggle.attributes('aria-expanded')).toBe('false')
  })

  it('disabled 与 invalid 落在宿主并传给段与按钮', () => {
    const w = mount(DatePicker, {
      props: { modelValue: '2026-09-04', disabled: true, invalid: true },
    })
    expect(w.find('[data-hn-date-picker]').attributes('data-invalid')).toBe('')
    expect(w.find('button[aria-label="打开日历"]').attributes('disabled')).toBeDefined()
    expect(w.find('[role="group"]').attributes('aria-invalid')).toBe('true')
    expect(w.findAll('[role="spinbutton"]').every(s => s.attributes('data-disabled') === '')).toBe(
      true,
    )
  })
})

describe('交互', () => {
  it('点按钮打开日历，选中一天即写回并关闭；v-model:open 同步', async () => {
    const w = mount(DatePicker, {
      props: {
        modelValue: '2026-09-04',
        'onUpdate:modelValue': (value: string | null) => w.setProps({ modelValue: value }),
        'onUpdate:open': (value: boolean) => w.setProps({ open: value }),
      },
      attachTo: document.body,
    })
    await w.find('button[aria-label="打开日历"]').trigger('click')
    await nextTick()
    expect(w.emitted('update:open')?.[0]).toEqual([true])
    const day = document.querySelector(
      '[data-hn-calendar] [data-value="2026-09-10"]',
    ) as HTMLElement
    expect(day).not.toBeNull()
    expect(
      document.querySelector('[data-hn-calendar] [data-selected]')?.getAttribute('data-value'),
    ).toBe('2026-09-04')
    day.click()
    await nextTick()
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['2026-09-10'])
    expect(w.emitted('update:open')?.[1]).toEqual([false])
  })

  it('清除钮清空值并发 clear，日历不打开', async () => {
    const w = mount(DatePicker, {
      props: { modelValue: '2026-09-04', clearable: true },
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
    const w = mount(DatePicker, {
      props: { modelValue: '2026-09-04', clearable: true },
      attrs: { 'aria-label': '发布日期' },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element)
  })
})
