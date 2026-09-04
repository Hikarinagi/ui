import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import DateRangeField from './DateRangeField.vue'
import type { DateRangeValue } from '../../lib/date'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

const spinsOf = (w: ReturnType<typeof mount>) => w.findAll('[role="spinbutton"]')

function mountRange(modelValue: DateRangeValue | null, extra: Record<string, unknown> = {}) {
  const w = mount(DateRangeField, {
    props: {
      modelValue,
      ...extra,
      'onUpdate:modelValue': (value: DateRangeValue | null) => w.setProps({ modelValue: value }),
    },
    attrs: { 'aria-label': '活动期间' },
    attachTo: document.body,
  })
  return w
}

describe('结构', () => {
  it('宿主是输入面，attrs 落在组元素上；起止两侧各自年月日，段的名称带起止前缀，中间是本地化分隔文字', () => {
    const w = mountRange(null, { class: 'w-96' })
    const host = w.find('[data-hn-date-range-field]')
    expect(host.classes()).toContain('hn-field')
    expect(host.classes()).toContain('w-96')
    expect(w.find('[role="group"]').attributes('aria-label')).toBe('活动期间')
    const spins = spinsOf(w)
    expect(spins.map(s => s.text())).toEqual(['年', '月', '日', '年', '月', '日'])
    expect(spins.map(s => s.attributes('aria-label'))).toEqual([
      '开始日期 年',
      '开始日期 月',
      '开始日期 日',
      '结束日期 年',
      '结束日期 月',
      '结束日期 日',
    ])
    expect(spins.every(s => s.attributes('data-placeholder') === '')).toBe(true)
    const separator = w.find('[role="group"] > span[aria-hidden="true"]:not([data-hn-segment])')
    expect(separator.text()).toBe('至')
  })

  it('v-model 是 { start, end } 的 ISO 字符串对：传入即填入两侧，方向键增减后仍以对象交出', async () => {
    const w = mountRange({ start: '2026-09-01', end: '2026-09-30' })
    const spins = spinsOf(w)
    expect(spins.map(s => s.attributes('aria-valuenow'))).toEqual([
      '2026',
      '9',
      '1',
      '2026',
      '9',
      '30',
    ])
    await spins[3]!.trigger('keydown', { key: 'ArrowUp' })
    expect(w.emitted('update:modelValue')?.[0]).toEqual([
      { start: '2026-09-01', end: '2027-09-30' },
    ])
    await spins[2]!.trigger('keydown', { key: 'ArrowUp' })
    expect(w.emitted('update:modelValue')?.[1]).toEqual([
      { start: '2026-09-02', end: '2027-09-30' },
    ])
  })

  it('只填一侧时另一侧显示占位；清空仅有的一侧后值为 null', async () => {
    const w = mountRange({ start: '2026-09-01', end: null })
    const spins = spinsOf(w)
    expect(spins.slice(0, 3).map(s => s.attributes('aria-valuenow'))).toEqual(['2026', '9', '1'])
    expect(spins.slice(3).every(s => s.attributes('data-placeholder') === '')).toBe(true)
    await spins[2]!.trigger('keydown', { key: 'Backspace' })
    expect(w.emitted('update:modelValue')?.[0]).toEqual([null])
  })

  it('granularity 为 minute 时两侧各多出时与分，交出的字符串到分', async () => {
    const w = mountRange(
      { start: '2026-09-01T09:00', end: '2026-09-01T18:30' },
      { granularity: 'minute' },
    )
    const spins = spinsOf(w)
    expect(spins).toHaveLength(10)
    await spins[9]!.trigger('keydown', { key: 'ArrowUp' })
    expect(w.emitted('update:modelValue')?.[0]).toEqual([
      { start: '2026-09-01T09:00', end: '2026-09-01T18:31' },
    ])
  })

  it('结束早于开始、或者任一侧超出 min / max 时宿主带 data-invalid 且组元素 aria-invalid', () => {
    const reversed = mountRange({ start: '2026-09-30', end: '2026-09-01' })
    expect(reversed.find('[data-hn-date-range-field]').attributes('data-invalid')).toBe('')
    expect(reversed.find('[role="group"]').attributes('aria-invalid')).toBe('true')
    const late = mountRange({ start: '2026-09-01', end: '2026-10-02' }, { max: '2026-09-30' })
    expect(late.find('[data-hn-date-range-field]').attributes('data-invalid')).toBe('')
    const fine = mountRange(
      { start: '2026-09-01', end: '2026-09-30' },
      { min: '2026-09-01', max: '2026-09-30' },
    )
    expect(fine.find('[data-hn-date-range-field]').attributes('data-invalid')).toBeUndefined()
    const flagged = mountRange(null, { invalid: true, disabled: true })
    expect(flagged.find('[data-hn-date-range-field]').attributes('data-invalid')).toBe('')
    expect(flagged.find('[data-hn-date-range-field]').attributes('data-disabled')).toBe('')
    expect(spinsOf(flagged).every(s => s.attributes('data-disabled') === '')).toBe(true)
  })

  it('clearable 且有值时显示清除钮，点击后值为 null 并发 clear', async () => {
    const w = mountRange({ start: '2026-09-01', end: null }, { clearable: true })
    await w.find('button[aria-label="清除"]').trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual([null])
    expect(w.emitted('clear')).toHaveLength(1)
    expect(w.find('button[aria-label="清除"]').exists()).toBe(false)
  })
})

describe('服务端渲染', () => {
  it('首屏渲染出两侧各段的值，没有聚焦或者校验态', async () => {
    const html = await renderToString(
      createSSRApp(
        defineComponent({
          render: () =>
            h(DateRangeField, {
              modelValue: { start: '2026-09-01', end: '2026-09-30' },
              'aria-label': '期间',
            }),
        }),
      ),
    )
    expect(html.match(/role="spinbutton"/g)).toHaveLength(6)
    expect(html).toContain('aria-valuenow="30"')
    expect(html).not.toContain('aria-invalid')
    expect(html).not.toContain('data-invalid')
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mountRange({ start: '2026-09-01', end: '2026-09-30' }, { clearable: true })
    await expectNoA11yViolations(w.element)
  })
})
