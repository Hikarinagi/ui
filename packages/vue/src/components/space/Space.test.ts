import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Space from './Space.vue'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('渲染', () => {
  it('默认弹性撑开,aria-hidden', () => {
    const w = mount(Space)
    expect(w.classes()).toContain('flex-1')
    expect(w.classes()).toContain('self-stretch')
    expect(w.attributes('aria-hidden')).toBe('true')
  })

  it('给 size 后变定长占位,不再弹性', () => {
    const w = mount(Space, { props: { size: 'md' } })
    expect(w.classes()).toContain('size-4')
    expect(w.classes()).not.toContain('flex-1')
  })
})
