import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import TimeField from './TimeField.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

const spinsOf = (w: ReturnType<typeof mount>) => w.findAll('[role="spinbutton"]')

function mountTime(modelValue: string | null, extra: Record<string, unknown> = {}) {
  const w = mount(TimeField, {
    props: {
      modelValue,
      ...extra,
      'onUpdate:modelValue': (value: string | null) => w.setProps({ modelValue: value }),
    },
    attrs: { 'aria-label': '开播时间' },
    attachTo: document.body,
  })
  return w
}

describe('结构', () => {
  it('宿主是输入面，attrs 落在各段的组元素上；中文下是时与分两段，空值时显示占位字样并带本地化名称', () => {
    const w = mountTime(null, { class: 'w-40' })
    expect(w.find('[data-hn-time-field]').classes()).toContain('hn-field')
    expect(w.find('[data-hn-time-field]').classes()).toContain('w-40')
    expect(w.find('[role="group"]').attributes('aria-label')).toBe('开播时间')
    const spins = spinsOf(w)
    expect(spins.map(s => s.attributes('aria-label'))).toEqual(['时', '分'])
    expect(spins.every(s => s.attributes('data-placeholder') === '')).toBe(true)
  })

  it('v-model 是 HH:mm 字符串：传入即填入各段，方向键增减后仍以字符串交出', async () => {
    const w = mountTime('09:30')
    const spins = spinsOf(w)
    expect(spins.map(s => s.attributes('aria-valuenow'))).toEqual(['9', '30'])
    await spins[0]!.trigger('keydown', { key: 'ArrowUp' })
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['10:30'])
    await spins[1]!.trigger('keydown', { key: 'ArrowDown' })
    expect(w.emitted('update:modelValue')?.[1]).toEqual(['10:29'])
  })

  it('granularity 为 second 时多出秒段，交出的字符串到秒；hour 只有时段', async () => {
    const seconds = mountTime('09:30:15', { granularity: 'second' })
    expect(spinsOf(seconds).map(s => s.attributes('aria-valuenow'))).toEqual(['9', '30', '15'])
    await spinsOf(seconds)[2]!.trigger('keydown', { key: 'ArrowUp' })
    expect(seconds.emitted('update:modelValue')?.[0]).toEqual(['09:30:16'])
    const hours = mountTime('09:00', { granularity: 'hour' })
    expect(spinsOf(hours)).toHaveLength(1)
    await spinsOf(hours)[0]!.trigger('keydown', { key: 'ArrowUp' })
    expect(hours.emitted('update:modelValue')?.[0]).toEqual(['10:00'])
  })

  it('minuteStep 让分段按步长增减', async () => {
    const w = mountTime('09:30', { minuteStep: 15 })
    await spinsOf(w)[1]!.trigger('keydown', { key: 'ArrowUp' })
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['09:45'])
  })

  it('超出 min 或者 max 时宿主带 data-invalid 且组元素 aria-invalid；invalid 与 disabled 各落各处', () => {
    const late = mountTime('23:00', { max: '18:00' })
    expect(late.find('[data-hn-time-field]').attributes('data-invalid')).toBe('')
    expect(late.find('[role="group"]').attributes('aria-invalid')).toBe('true')
    const fine = mountTime('12:00', { min: '09:00', max: '18:00' })
    expect(fine.find('[data-hn-time-field]').attributes('data-invalid')).toBeUndefined()
    const flagged = mountTime('12:00', { invalid: true, disabled: true })
    expect(flagged.find('[data-hn-time-field]').attributes('data-invalid')).toBe('')
    expect(flagged.find('[data-hn-time-field]').attributes('data-disabled')).toBe('')
    expect(spinsOf(flagged).every(s => s.attributes('data-disabled') === '')).toBe(true)
  })

  it('clearable 且有值时显示清除钮，点击清空并发 clear', async () => {
    const w = mountTime('09:30', { clearable: true })
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
          render: () => h(TimeField, { modelValue: '09:30', 'aria-label': '时间' }),
        }),
      ),
    )
    expect(html.match(/role="spinbutton"/g)).toHaveLength(2)
    expect(html).toContain('aria-valuenow="30"')
    expect(html).not.toContain('aria-invalid')
    expect(html).not.toContain('data-invalid')
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mountTime('09:30', { clearable: true })
    await expectNoA11yViolations(w.element)
  })
})
