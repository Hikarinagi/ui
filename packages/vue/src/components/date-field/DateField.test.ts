import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import DateField from './DateField.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

const spinsOf = (w: ReturnType<typeof mount>) => w.findAll('[role="spinbutton"]')

describe('结构', () => {
  it('宿主是输入面，attrs 落在各段的组元素上；中文下分段顺序是年月日，空值时各段显示占位字样并带本地化名称', () => {
    const w = mount(DateField, {
      props: { modelValue: null, class: 'w-72' },
      attrs: { 'aria-label': '发布日期' },
    })
    expect(w.find('[data-hn-date-field]').classes()).toContain('hn-field')
    expect(w.find('[data-hn-date-field]').classes()).toContain('w-72')
    expect(w.find('[role="group"]').attributes('aria-label')).toBe('发布日期')
    const spins = spinsOf(w)
    expect(spins.map(s => s.text())).toEqual(['年', '月', '日'])
    expect(spins.map(s => s.attributes('aria-label'))).toEqual(['年', '月', '日'])
    expect(spins.every(s => s.attributes('data-placeholder') === '')).toBe(true)
    expect(w.findAll('[data-hn-segment][aria-hidden="true"]').map(s => s.text())).toEqual([
      '/',
      '/',
    ])
  })

  it('v-model 是 ISO 字符串：传入即填入各段，方向键增减后仍以字符串交出', async () => {
    const w = mount(DateField, {
      props: {
        modelValue: '2026-09-04',
        'onUpdate:modelValue': (value: string | null) => w.setProps({ modelValue: value }),
      },
    })
    const spins = spinsOf(w)
    expect(spins.map(s => s.attributes('aria-valuenow'))).toEqual(['2026', '9', '4'])
    await spins[0]!.trigger('keydown', { key: 'ArrowUp' })
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['2027-09-04'])
    await spins[2]!.trigger('keydown', { key: 'ArrowDown' })
    expect(w.emitted('update:modelValue')?.[1]).toEqual(['2027-09-03'])
    expect(spins.map(s => s.attributes('aria-valuenow'))).toEqual(['2027', '9', '3'])
  })

  it('granularity 为 minute 时多出时与分两段，交出的字符串到分', async () => {
    const w = mount(DateField, { props: { modelValue: '2026-09-04T10:30', granularity: 'minute' } })
    const spins = spinsOf(w)
    expect(spins.map(s => s.attributes('aria-valuenow'))).toEqual(['2026', '9', '4', '10', '30'])
    await spins[4]!.trigger('keydown', { key: 'ArrowUp' })
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['2026-09-04T10:31'])
  })

  it('超出 min 或者 max 时宿主带 data-invalid 且组元素 aria-invalid；invalid 与 disabled 各落各处', () => {
    const late = mount(DateField, { props: { modelValue: '2026-09-04', max: '2026-09-01' } })
    expect(late.find('[data-hn-date-field]').attributes('data-invalid')).toBe('')
    expect(late.find('[role="group"]').attributes('aria-invalid')).toBe('true')
    const fine = mount(DateField, {
      props: { modelValue: '2026-09-04', min: '2026-09-01', max: '2026-09-30' },
    })
    expect(fine.find('[data-hn-date-field]').attributes('data-invalid')).toBeUndefined()
    const flagged = mount(DateField, {
      props: { modelValue: '2026-09-04', invalid: true, disabled: true },
    })
    expect(flagged.find('[data-hn-date-field]').attributes('data-invalid')).toBe('')
    expect(flagged.find('[data-hn-date-field]').attributes('data-disabled')).toBe('')
    expect(spinsOf(flagged).every(s => s.attributes('data-disabled') === '')).toBe(true)
  })

  it('clearable 且有值时显示清除钮，点击清空并发 clear', async () => {
    const w = mount(DateField, {
      props: {
        modelValue: '2026-09-04',
        clearable: true,
        'onUpdate:modelValue': (value: string | null) => w.setProps({ modelValue: value }),
      },
      attachTo: document.body,
    })
    await w.find('button[aria-label="清除"]').trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual([null])
    expect(w.emitted('clear')).toHaveLength(1)
    expect(w.find('button[aria-label="清除"]').exists()).toBe(false)
  })
})

describe('服务端渲染', () => {
  it('首屏渲染出各段的值，没有聚焦或者校验态', async () => {
    const html = await renderToString(
      createSSRApp(
        defineComponent({
          render: () => h(DateField, { modelValue: '2026-09-04', 'aria-label': '日期' }),
        }),
      ),
    )
    expect(html.match(/role="spinbutton"/g)).toHaveLength(3)
    expect(html).toContain('aria-valuenow="2026"')
    expect(html).not.toContain('aria-invalid')
    expect(html).not.toContain('data-invalid')
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mount(DateField, {
      props: { modelValue: '2026-09-04', clearable: true },
      attrs: { 'aria-label': '发布日期' },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element)
  })
})
