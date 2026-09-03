import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import RangeSlider from './RangeSlider.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('结构', () => {
  it('根是 role=group，attrs 落在根上；两个拇指各带取值与语言包给的名称；根与拇指各自带进度变量', async () => {
    const w = mount(RangeSlider, {
      props: { modelValue: [20, 60], class: 'w-64' },
      attrs: { 'aria-label': '价格区间' },
    })
    await nextTick()
    expect(w.attributes('role')).toBe('group')
    expect(w.attributes('aria-label')).toBe('价格区间')
    expect(w.attributes('data-hn-range-slider')).toBe('')
    expect(w.classes()).toContain('w-64')
    expect(w.attributes('style')).toContain('--hn-slider-p: 0.2')
    expect(w.attributes('style')).toContain('--hn-slider-q: 0.6')
    const thumbs = w.findAll('[role="slider"]')
    expect(thumbs).toHaveLength(2)
    expect(thumbs.map(t => t.attributes('aria-valuenow'))).toEqual(['20', '60'])
    expect(thumbs.map(t => t.attributes('aria-label'))).toEqual(['最小值', '最大值'])
    expect(thumbs[0]!.attributes('style')).toContain('--hn-slider-p: 0.2')
    expect(thumbs[1]!.attributes('style')).toContain('--hn-slider-p: 0.6')
  })

  it('未绑定值时落在整段范围；三档尺寸落在根上；disabled 落到根与拇指', async () => {
    const empty = mount(RangeSlider, { props: { min: 10, max: 50 } })
    await nextTick()
    expect(empty.findAll('[role="slider"]').map(t => t.attributes('aria-valuenow'))).toEqual([
      '10',
      '50',
    ])
    expect(mount(RangeSlider, { props: { size: 'lg' } }).classes()).toContain(
      '[--hn-slider-h:1.75rem]',
    )
    const disabled = mount(RangeSlider, { props: { modelValue: [1, 2], disabled: true } })
    expect(disabled.attributes('data-disabled')).toBe('')
    expect(
      disabled.findAll('[role="slider"]').every(t => t.attributes('data-disabled') === ''),
    ).toBe(true)
  })
})

describe('服务端渲染', () => {
  it('首屏就有两个拇指与区间填充', async () => {
    const html = await renderToString(
      createSSRApp(
        defineComponent({
          render: () => h(RangeSlider, { modelValue: [25, 75], 'aria-label': '区间' }),
        }),
      ),
    )
    expect(html).toContain('--hn-slider-p:0.25')
    expect(html).toContain('--hn-slider-q:0.75')
    expect(html.match(/role="slider"/g)).toHaveLength(2)
    expect(html).toContain('var(--hn-slider-q)-var(--hn-slider-p)')
  })
})

describe('交互', () => {
  it('方向键移动持焦的拇指并发 update 与 commit；minSteps 阻止两个拇指靠得太近', async () => {
    const w = mount(RangeSlider, {
      props: {
        modelValue: [20, 60] as [number, number],
        step: 10,
        minSteps: 2,
        'onUpdate:modelValue': v => w.setProps({ modelValue: v as [number, number] }),
      },
      attachTo: document.body,
    })
    await nextTick()
    const thumbs = () => w.findAll('[role="slider"]')
    await thumbs()[1]!.trigger('focus')
    await thumbs()[1]!.trigger('keydown', { key: 'ArrowLeft' })
    expect(w.emitted('update:modelValue')?.[0]).toEqual([[20, 50]])
    expect(w.emitted('commit')?.[0]).toEqual([[20, 50]])
    await thumbs()[1]!.trigger('keydown', { key: 'ArrowLeft' })
    expect(w.emitted('update:modelValue')?.[1]).toEqual([[20, 40]])
    await thumbs()[1]!.trigger('keydown', { key: 'ArrowLeft' })
    expect(w.emitted('update:modelValue')).toHaveLength(2)
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mount(RangeSlider, {
      props: { modelValue: [20, 60], marks: [{ value: 0, label: '低' }] },
      attrs: { 'aria-label': '价格区间' },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element)
  })
})
