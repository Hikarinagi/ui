import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Text from './Text.vue'

describe('Text', () => {
  it('默认是 p · base 字号 · 默认前景 · 常规字重', () => {
    const w = mount(Text, { slots: { default: () => '正文' } })
    expect(w.element.tagName).toBe('P')
    expect(w.classes()).toContain('text-base')
    expect(w.classes()).toContain('text-fg')
    expect(w.classes()).toContain('font-normal')
  })

  it('as 多态渲染', () => {
    expect(mount(Text, { props: { as: 'span' } }).element.tagName).toBe('SPAN')
    expect(mount(Text, { props: { as: 'label' } }).element.tagName).toBe('LABEL')
  })

  it('size 覆盖七档字阶,类名带配对行高语义', () => {
    for (const size of ['xs', 'sm', 'base', 'md', 'lg', 'xl', '2xl'] as const) {
      expect(mount(Text, { props: { size } }).classes()).toContain(`text-${size}`)
    }
  })

  it('tone 映射语义前景色,不接触原色阶', () => {
    expect(mount(Text, { props: { tone: 'muted' } }).classes()).toContain('text-muted')
    expect(mount(Text, { props: { tone: 'accent' } }).classes()).toContain('text-accent-text')
    expect(mount(Text, { props: { tone: 'danger' } }).classes()).toContain('text-danger-text')
    expect(mount(Text, { props: { tone: 'disabled' } }).classes()).toContain('text-disabled')
  })

  it('weight 只有三档', () => {
    expect(mount(Text, { props: { weight: 'medium' } }).classes()).toContain('font-medium')
    expect(mount(Text, { props: { weight: 'semibold' } }).classes()).toContain('font-semibold')
  })

  it('truncate 单行截断', () => {
    expect(mount(Text, { props: { truncate: true } }).classes()).toContain('truncate')
  })

  it('class 透传且冲突由 tw-merge 裁决', () => {
    const w = mount(Text, { props: { class: 'text-lg' } })
    expect(w.classes()).toContain('text-lg')
    expect(w.classes()).not.toContain('text-base')
  })
})
