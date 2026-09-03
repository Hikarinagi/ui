import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Slider from './Slider.vue'
import TooltipProvider from '../tooltip/TooltipProvider.vue'

const withProvider = (props: Record<string, unknown>) =>
  mount(defineComponent({ render: () => h(TooltipProvider, null, () => h(Slider, props)) }))
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('结构', () => {
  it('根是 data-hn-slider 的容器，拇指是 role=slider 并带取值范围；attrs 落在拇指上，class 落在根上', async () => {
    const w = mount(Slider, {
      props: { modelValue: 30, class: 'w-64' },
      attrs: { 'aria-label': '音量', 'data-x': '1' },
    })
    await nextTick()
    expect(w.attributes('data-hn-slider')).toBe('')
    expect(w.classes()).toContain('w-64')
    const thumb = w.find('[role="slider"]')
    expect(thumb.attributes('aria-label')).toBe('音量')
    expect(thumb.attributes('data-x')).toBe('1')
    expect(thumb.attributes('aria-valuenow')).toBe('30')
    expect(thumb.attributes('aria-valuemin')).toBe('0')
    expect(thumb.attributes('aria-valuemax')).toBe('100')
    expect(thumb.attributes('tabindex')).toBe('0')
    expect(thumb.attributes('style')).toContain('left: calc(30%')
  })

  it('min / max / step 与 format 生效；未绑定值时落在 min', async () => {
    const w = mount(Slider, {
      props: { modelValue: 2.5, min: 1, max: 5, step: 0.5, format: v => `${v} 星` },
    })
    await nextTick()
    const thumb = w.find('[role="slider"]')
    expect(thumb.attributes('aria-valuemin')).toBe('1')
    expect(thumb.attributes('aria-valuemax')).toBe('5')
    const empty = mount(Slider, { props: { min: 10 } })
    await nextTick()
    expect(empty.find('[role="slider"]').attributes('aria-valuenow')).toBe('10')
  })

  it('取值标签是 Tooltip：none 不挂提示；没有 TooltipProvider 时也不挂；有提供者时拇指是提示的触发器', async () => {
    const bare = mount(Slider, { props: { modelValue: 1, label: 'always' } })
    await nextTick()
    expect(bare.find('[role="slider"]').attributes('data-state')).toBeUndefined()
    const none = withProvider({ modelValue: 1, label: 'none' })
    await nextTick()
    expect(none.find('[role="slider"]').attributes('data-state')).toBeUndefined()
    const auto = withProvider({ modelValue: 1 })
    await nextTick()
    expect(auto.find('[role="slider"]').attributes('data-state')).toBe('closed')
    const always = withProvider({ modelValue: 1, label: 'always' })
    await nextTick()
    expect(always.find('[role="slider"]').attributes('data-state')).toBe('instant-open')
  })

  it('marks 在轨道上按百分比放点，有文字时多一行标签', () => {
    const w = mount(Slider, {
      props: {
        modelValue: 50,
        marks: [{ value: 0, label: '慢' }, { value: 50 }, { value: 100, label: '快' }],
      },
    })
    const dots = w.findAll('[aria-hidden="true"] > span > span.rounded-full')
    expect(dots).toHaveLength(3)
    const holders = dots.map(d => d.element.parentElement as HTMLElement)
    expect(holders.map(h => h.style.insetInlineStart)).toEqual(['0%', '50%', '100%'])
    const labels = w.findAll('.text-muted > span')
    expect(labels.map(l => l.text())).toEqual(['慢', '', '快'])
    const bare = mount(Slider, { props: { modelValue: 50, marks: [{ value: 50 }] } })
    expect(bare.find('.text-muted').exists()).toBe(false)
  })

  it('三档尺寸落在根的变量上；disabled 落到根与拇指', () => {
    expect(mount(Slider, { props: { size: 'sm' } }).classes()).toContain(
      '[--hn-slider-thumb:0.75rem]',
    )
    expect(mount(Slider, { props: { size: 'lg' } }).classes()).toContain('[--hn-slider-h:1.75rem]')
    const disabled = mount(Slider, { props: { modelValue: 1, disabled: true } })
    expect(disabled.attributes('data-disabled')).toBe('')
    expect(disabled.find('[role="slider"]').attributes('data-disabled')).toBe('')
    expect(disabled.find('[role="slider"]').attributes('tabindex')).toBeUndefined()
  })
})

describe('服务端渲染', () => {
  it('首屏就有拇指与填充：位置由根上的进度变量决定，不等水合', async () => {
    const html = await renderToString(
      createSSRApp(
        defineComponent({ render: () => h(Slider, { modelValue: 25, 'aria-label': '音量' }) }),
      ),
    )
    expect(html).toContain('--hn-slider-p:0.25')
    expect(html).toContain('role="slider"')
    const thumb = html.match(/<span[^>]*role="slider"[^>]*>/)?.[0] ?? ''
    expect(thumb).toContain('!block')
    expect(thumb).toContain('!start-[calc(')
    expect(html).toContain('--hn-slider-p)+var(--hn-slider-thumb)+0.5rem)]')
  })
})

describe('交互', () => {
  it('方向键按 step 改值并发 update；End 跳到 max；键盘改值也发 commit', async () => {
    const w = mount(Slider, {
      props: { modelValue: 50, step: 5, 'onUpdate:modelValue': v => w.setProps({ modelValue: v }) },
      attachTo: document.body,
    })
    const thumb = w.find('[role="slider"]')
    await thumb.trigger('keydown', { key: 'ArrowRight' })
    expect(w.emitted('update:modelValue')?.[0]).toEqual([55])
    expect(w.emitted('commit')?.[0]).toEqual([55])
    await thumb.trigger('keydown', { key: 'End' })
    expect(w.emitted('update:modelValue')?.[1]).toEqual([100])
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mount(Slider, {
      props: {
        modelValue: 40,
        marks: [
          { value: 0, label: '低' },
          { value: 100, label: '高' },
        ],
      },
      attrs: { 'aria-label': '音量' },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element)
  })
})
