import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import AspectRatio from './AspectRatio.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('渲染', () => {
  it('默认 16:9,经 reka 的 padding-bottom 机制成比例;class 落在自持外壳上', () => {
    const w = mount(AspectRatio, {
      props: { class: 'w-40' },
      slots: { default: () => h('div', '内容') },
    })
    expect(w.classes()).toContain('w-40')
    const wrapper = w.element.firstElementChild as HTMLElement
    expect(wrapper.style.paddingBottom).toBe(`${(9 / 16) * 100}%`)
  })

  it('ratio 可覆写', () => {
    const w = mount(AspectRatio, {
      props: { ratio: 1 },
      slots: { default: () => h('div', '方') },
    })
    expect((w.element.firstElementChild as HTMLElement).style.paddingBottom).toBe('100%')
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const w = mount(AspectRatio, {
      slots: { default: () => h('p', '内容') },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element as HTMLElement)
  })
})
