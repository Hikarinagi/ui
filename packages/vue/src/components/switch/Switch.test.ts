import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Switch from './Switch.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('结构', () => {
  it('根是 label，轨道是 role=switch 的按钮，拇指在轨道内；attrs 落在轨道上，class 落在根上', () => {
    const w = mount(Switch, {
      props: { description: '播放完自动跳到下一话', class: 'w-64' },
      attrs: { id: 'autoplay', 'data-x': '1' },
      slots: { default: '自动播放' },
    })
    expect(w.element.tagName).toBe('LABEL')
    expect(w.attributes('data-hn-switch')).toBe('')
    expect(w.attributes('data-hn-state-group')).toBe('')
    expect(w.classes()).toContain('w-64')
    const track = w.find('[role="switch"]')
    expect(track.element.tagName).toBe('BUTTON')
    expect(track.attributes('type')).toBe('button')
    expect(track.attributes('id')).toBe('autoplay')
    expect(track.attributes('data-x')).toBe('1')
    expect(track.attributes('aria-checked')).toBe('false')
    expect(track.attributes('data-state')).toBe('unchecked')
    expect(track.attributes('data-hn-on')).toBeUndefined()
    expect(track.find('[data-hn-thumb]').exists()).toBe(true)
    expect(w.text()).toContain('自动播放')
    expect(w.find('.text-muted').text()).toBe('播放完自动跳到下一话')
  })

  it('选中时 aria-checked、data-state 与 data-hn-on 同步；无文字时只有轨道', () => {
    const on = mount(Switch, { props: { modelValue: true }, attrs: { 'aria-label': '自动播放' } })
    const track = on.find('[role="switch"]')
    expect(track.attributes('aria-checked')).toBe('true')
    expect(track.attributes('data-state')).toBe('checked')
    expect(track.attributes('data-hn-on')).toBe('')
    expect(track.attributes('aria-label')).toBe('自动播放')
    expect(on.findAll(':scope > span')).toHaveLength(0)
  })

  it('三档尺寸落在轨道的变量上，根的字号与描述随档位变化', () => {
    const sm = mount(Switch, { props: { size: 'sm', description: 'd' } })
    expect(sm.classes()).toContain('text-sm')
    expect(sm.find('[role="switch"]').classes()).toContain('[--hn-switch-h:1.25rem]')
    expect(sm.find('.text-muted').classes()).toContain('text-xs')
    const lg = mount(Switch, { props: { size: 'lg', description: 'd' } })
    expect(lg.classes()).toContain('text-md')
    expect(lg.find('[role="switch"]').classes()).toContain('[--hn-switch-h:1.75rem]')
  })

  it('disabled 落在根与轨道上；invalid 只落在轨道上', () => {
    const disabled = mount(Switch, { props: { disabled: true } })
    expect(disabled.attributes('data-disabled')).toBe('')
    expect(disabled.find('[role="switch"]').attributes('disabled')).toBeDefined()
    const invalid = mount(Switch, { props: { invalid: true } })
    expect(invalid.attributes('data-invalid')).toBeUndefined()
    const track = invalid.find('[role="switch"]')
    expect(track.attributes('data-invalid')).toBe('')
    expect(track.attributes('aria-invalid')).toBe('true')
  })
})

describe('交互', () => {
  it('点击轨道切换；禁用时不响应', async () => {
    const w = mount(Switch, {
      props: { modelValue: false, 'onUpdate:modelValue': v => w.setProps({ modelValue: v }) },
    })
    await w.find('[role="switch"]').trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual([true])
    await w.find('[role="switch"]').trigger('click')
    expect(w.emitted('update:modelValue')?.[1]).toEqual([false])
    const disabled = mount(Switch, { props: { disabled: true } })
    await disabled.find('[role="switch"]').trigger('click')
    expect(disabled.emitted('update:modelValue')).toBeUndefined()
  })
})

describe('无障碍', () => {
  it('有文字与仅 aria-label 两种形态均无违规', async () => {
    const labelled = mount(Switch, {
      props: { modelValue: true, description: '播放完自动跳到下一话' },
      slots: { default: '自动播放' },
      attachTo: document.body,
    })
    await expectNoA11yViolations(labelled.element)
    const bare = mount(Switch, { attrs: { 'aria-label': '自动播放' }, attachTo: document.body })
    await expectNoA11yViolations(bare.element)
  })
})
