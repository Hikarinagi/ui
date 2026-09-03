import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Toggle from './Toggle.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('结构', () => {
  it('根是带 aria-pressed 的按钮，attrs 与 class 落在它上面；默认 ghost 中性 md', () => {
    const w = mount(Toggle, {
      props: { class: 'w-32' },
      attrs: { 'data-x': '1' },
      slots: { default: '仅看已完结' },
    })
    const button = w.find('button')
    expect(button.attributes('aria-pressed')).toBe('false')
    expect(button.attributes('data-state')).toBe('off')
    expect(button.attributes('data-hn-toggle')).toBe('')
    expect(button.attributes('data-x')).toBe('1')
    expect(button.classes()).toContain('w-32')
    expect(button.classes()).toContain('hn-state-layer')
    expect(button.classes()).toContain('text-fg')
    expect(button.classes()).toContain('aria-pressed:text-accent-text')
    expect(button.classes()).toContain('h-[var(--hn-control-h-md)]')
    expect(button.text()).toBe('仅看已完结')
  })

  it('label 表示图标型：正方、aria-label 取 label；outline、pill 与 disabled 落在按钮上', () => {
    const icon = mount(Toggle, {
      props: { label: '加粗', variant: 'outline', pill: true, disabled: true },
      slots: { icon: '<svg />' },
    })
    const button = icon.find('button')
    expect(button.attributes('aria-label')).toBe('加粗')
    expect(button.classes()).toContain('aspect-square')
    expect(button.classes()).toContain('border-line')
    expect(button.classes()).toContain('rounded-full')
    expect(button.attributes('disabled')).toBeDefined()
    expect(button.find('svg').exists()).toBe(true)
  })
})

describe('交互', () => {
  it('点击在按下与松开之间切换并写回 v-model', async () => {
    const w = mount(Toggle, {
      props: {
        modelValue: false,
        'onUpdate:modelValue': (value: boolean) => w.setProps({ modelValue: value }),
      },
      slots: { default: '加粗' },
    })
    await w.find('button').trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(w.find('button').attributes('aria-pressed')).toBe('true')
    expect(w.find('button').attributes('data-state')).toBe('on')
    await w.find('button').trigger('click')
    expect(w.emitted('update:modelValue')?.[1]).toEqual([false])
  })

  it('#icon 拿到 pressed；有 #pressed-icon 时按下后换成它', async () => {
    const w = mount(Toggle, {
      props: { label: '收藏', modelValue: false },
      slots: {
        icon: ({ pressed }: { pressed: boolean }) => h('i', { 'data-pressed': String(pressed) }),
        'pressed-icon': () => h('b', '已收藏'),
      },
    })
    expect(w.find('i').attributes('data-pressed')).toBe('false')
    expect(w.find('b').exists()).toBe(false)
    await w.setProps({ modelValue: true })
    expect(w.find('b').text()).toBe('已收藏')
  })
})

describe('无障碍', () => {
  it('文字型与图标型都无违规', async () => {
    const text = mount(Toggle, { slots: { default: '加粗' }, attachTo: document.body })
    await expectNoA11yViolations(text.element)
    const icon = mount(Toggle, {
      props: { label: '加粗', modelValue: true },
      slots: { icon: '<svg aria-hidden="true" />' },
      attachTo: document.body,
    })
    await expectNoA11yViolations(icon.element)
  })
})
