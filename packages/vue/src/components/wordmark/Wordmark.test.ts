import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Wordmark from './Wordmark.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('结构与语义', () => {
  it('锁定组合:内联字标 svg 加排印的 "UI",整体是一张带名字的图', () => {
    const w = mount(Wordmark)
    expect(w.attributes('role')).toBe('img')
    expect(w.attributes('aria-label')).toBe('Hina UI')
    expect(w.find('svg').exists()).toBe(true)
    expect(w.text()).toBe('UI')
  })

  it('默认吃 text-fg;class 可覆写着色', () => {
    expect(mount(Wordmark).classes()).toContain('text-fg')
    const branded = mount(Wordmark, { props: { class: 'text-hina-brand' } })
    expect(branded.classes()).toContain('text-hina-brand')
    expect(branded.classes()).not.toContain('text-fg')
  })

  it('无障碍零违例', async () => {
    const w = mount(Wordmark, { attachTo: document.body })
    await expectNoA11yViolations(w.element)
  })
})
