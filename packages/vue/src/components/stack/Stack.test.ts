import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Stack from './Stack.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('渲染', () => {
  it('默认 div + flex-col,间距吃密度 token', () => {
    const w = mount(Stack)
    expect(w.element.tagName).toBe('DIV')
    expect(w.classes()).toContain('flex')
    expect(w.classes()).toContain('flex-col')
    expect(w.classes()).toContain('gap-[var(--hn-stack-gap)]')
  })

  it('gap 码切换公共尺度,align 落对应类', () => {
    expect(mount(Stack, { props: { gap: 'sm' } }).classes()).toContain('gap-2')
    expect(mount(Stack, { props: { gap: 'none' } }).classes()).toContain('gap-0')
    expect(mount(Stack, { props: { align: 'center' } }).classes()).toContain('items-center')
    expect(mount(Stack).classes().join(' ')).not.toContain('items-')
  })

  it('as 换语义标签', () => {
    expect(mount(Stack, { props: { as: 'section' } }).element.tagName).toBe('SECTION')
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const w = mount(Stack, {
      slots: { default: () => [h('p', '甲'), h('p', '乙')] },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element as HTMLElement)
  })
})
