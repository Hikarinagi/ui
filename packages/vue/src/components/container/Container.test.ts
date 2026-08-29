import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Container from './Container.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('渲染', () => {
  it('默认 md:居中、整宽、响应式页缘', () => {
    const w = mount(Container)
    expect(w.classes()).toContain('mx-auto')
    expect(w.classes()).toContain('w-full')
    expect(w.classes()).toContain('px-4')
    expect(w.classes()).toContain('sm:px-6')
    expect(w.classes()).toContain('max-w-5xl')
  })

  it('四档宽度切换,as 换语义标签', () => {
    expect(mount(Container, { props: { size: 'sm' } }).classes()).toContain('max-w-3xl')
    expect(mount(Container, { props: { size: 'xl' } }).classes()).toContain('max-w-7xl')
    expect(mount(Container, { props: { as: 'main' } }).element.tagName).toBe('MAIN')
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const w = mount(Container, {
      slots: { default: () => h('p', '内容') },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element as HTMLElement)
  })
})
