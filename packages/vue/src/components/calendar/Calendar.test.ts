import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Calendar from './Calendar.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

const headOf = (w: ReturnType<typeof mount>) => w.findAll('th').map(th => th.text())
const daysOf = (w: ReturnType<typeof mount>) => w.findAll('[data-reka-calendar-cell-trigger]')
const dayOf = (w: ReturnType<typeof mount>, date: string) => w.find(`[data-value="${date}"]`)

describe('结构', () => {
  it('中文下一周从周一开始、表头是一到日的窄格式；固定六周共 42 格；标题与根的名称按语言生成', () => {
    const w = mount(Calendar, { props: { placeholder: '2026-09-04' } })
    expect(headOf(w)).toEqual(['一', '二', '三', '四', '五', '六', '日'])
    expect(daysOf(w)).toHaveLength(42)
    expect(w.find('[data-hn-calendar]').attributes('aria-label')).toBe('日历, 2026年9月')
    expect(w.find('button[aria-label="上个月"]').exists()).toBe(true)
    expect(w.find('button[aria-label="下个月"]').exists()).toBe(true)
    expect(dayOf(w, '2026-08-31').attributes('data-outside-view')).toBe('')
    expect(dayOf(w, '2026-09-01').attributes('data-outside-view')).toBeUndefined()
  })

  it('weekStartsOn 与 weekdayFormat 改变表头', () => {
    const w = mount(Calendar, {
      props: { placeholder: '2026-09-04', weekStartsOn: 0, weekdayFormat: 'short' },
    })
    expect(headOf(w)[0]).toBe('周日')
  })
})

describe('值', () => {
  it('v-model 是 ISO 字符串：选中的格带 data-selected 并承接焦点停靠，点击另一格交出新字符串', async () => {
    const w = mount(Calendar, { props: { modelValue: '2026-09-04' } })
    expect(dayOf(w, '2026-09-04').attributes('data-selected')).toBe('true')
    expect(dayOf(w, '2026-09-04').attributes('tabindex')).toBe('0')
    expect(dayOf(w, '2026-09-05').attributes('tabindex')).toBe('-1')
    await dayOf(w, '2026-09-05').trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['2026-09-05'])
  })

  it('min 与 max 之外的格禁用；unavailable 以 ISO 字符串判定并划去', () => {
    const w = mount(Calendar, {
      props: {
        modelValue: '2026-09-04',
        min: '2026-09-02',
        max: '2026-09-20',
        unavailable: (date: string) => date === '2026-09-10',
      },
    })
    expect(dayOf(w, '2026-09-01').attributes('data-disabled')).toBe('')
    expect(dayOf(w, '2026-09-21').attributes('data-disabled')).toBe('')
    expect(dayOf(w, '2026-09-02').attributes('data-disabled')).toBeUndefined()
    expect(dayOf(w, '2026-09-10').attributes('data-unavailable')).toBe('')
    expect(dayOf(w, '2026-09-10').attributes('aria-disabled')).toBe('true')
  })

  it('readonly 时点击不改值；disabled 落在根上', async () => {
    const w = mount(Calendar, { props: { modelValue: '2026-09-04', readonly: true } })
    await dayOf(w, '2026-09-05').trigger('click')
    expect(w.emitted('update:modelValue')).toBeUndefined()
    const off = mount(Calendar, { props: { modelValue: '2026-09-04', disabled: true } })
    expect(off.find('[data-hn-calendar]').attributes('data-disabled')).toBe('')
  })
})

describe('服务端渲染', () => {
  it('首屏渲染出整月网格与选中格', async () => {
    const html = await renderToString(
      createSSRApp(defineComponent({ render: () => h(Calendar, { modelValue: '2026-09-04' }) })),
    )
    expect(html.match(/data-reka-calendar-cell-trigger/g)).toHaveLength(42)
    expect(html).toContain('data-value="2026-09-04"')
    expect(html.match(/data-selected="true"/g)).toHaveLength(1)
  })
})

describe('显示的月份', () => {
  it('翻页后以 update:placeholder 交出新视图的日期；父级改 placeholder 即切换显示的月份', async () => {
    const w = mount(Calendar, {
      props: {
        placeholder: '2026-09-01',
        'onUpdate:placeholder': (value: string | undefined) => w.setProps({ placeholder: value }),
      },
    })
    await w.find('button[aria-label="下个月"]').trigger('click')
    expect(w.emitted('update:placeholder')?.at(-1)).toEqual(['2026-10-01'])
    expect(dayOf(w, '2026-10-15').exists()).toBe(true)
    await w.setProps({ placeholder: '2026-12-20' })
    expect(w.find('button[aria-label="选择月份"]').text()).toBe('2026年12月')
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mount(Calendar, { props: { modelValue: '2026-09-04' }, attachTo: document.body })
    await expectNoA11yViolations(w.element)
  })
})

describe('年月切换', () => {
  it('点击标题进入月份视图：十二个月、当前月选中；点一个月回到日视图并翻到该月；月份视图的标题进入年份视图，点一年换年后回到月份视图', async () => {
    const w = mount(Calendar, {
      props: { modelValue: '2026-09-04' },
      attachTo: document.body,
    })
    const root = w.find('[data-hn-calendar]')
    expect(root.attributes('data-level')).toBe('day')
    await w.find('button[aria-label="选择月份"]').trigger('click')
    expect(root.attributes('data-level')).toBe('month')
    const months = w.findAll('[data-reka-month-picker-cell-trigger]')
    expect(months).toHaveLength(12)
    expect(
      w
        .find('[data-reka-month-picker-cell-trigger][data-value="2026-09-01"]')
        .attributes('data-selected'),
    ).toBe('true')
    expect(w.find('button[aria-label="选择年份"]').text()).toBe('2026年')
    await w.find('button[aria-label="选择年份"]').trigger('click')
    expect(root.attributes('data-level')).toBe('year')
    const years = w.findAll('[data-reka-year-picker-cell-trigger]')
    expect(years).toHaveLength(12)
    expect(years[0]!.attributes('data-value')).toBe('2020-01-01')
    await w.find('[data-reka-year-picker-cell-trigger][data-value="2028-01-01"]').trigger('click')
    expect(root.attributes('data-level')).toBe('month')
    expect(w.find('button[aria-label="选择年份"]').text()).toBe('2028年')
    await w.find('[data-reka-month-picker-cell-trigger][data-value="2028-03-01"]').trigger('click')
    expect(root.attributes('data-level')).toBe('day')
    expect(w.find('button[aria-label="选择月份"]').text()).toBe('2028年3月')
    expect(w.find('[data-value="2028-03-01"]').exists()).toBe(true)
    expect(w.emitted('update:modelValue')).toBeUndefined()
  })

  it('Esc 逐级返回，不冒泡到外面', async () => {
    const w = mount(Calendar, {
      props: { modelValue: '2026-09-04' },
      attachTo: document.body,
    })
    await w.find('button[aria-label="选择月份"]').trigger('click')
    await w.find('button[aria-label="选择年份"]').trigger('click')
    const root = w.find('[data-hn-calendar]')
    await w.find('[data-reka-year-picker-cell-trigger]').trigger('keydown', { key: 'Escape' })
    expect(root.attributes('data-level')).toBe('month')
    await w.find('[data-reka-month-picker-cell-trigger]').trigger('keydown', { key: 'Escape' })
    expect(root.attributes('data-level')).toBe('day')
  })
})
