import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Avatar from './Avatar.vue'
import AvatarGroup from './AvatarGroup.vue'

beforeEach(() => {
  document.body.innerHTML = ''
})

function group(props: Record<string, unknown>, names: string[]) {
  return mount(AvatarGroup, {
    props,
    slots: { default: () => names.map(name => h(Avatar, { name })) },
  })
}

describe('溢出计数', () => {
  it('不设 max 时全部显示,没有计数位', () => {
    const w = group({}, ['甲', '乙', '丙'])
    expect(w.findAllComponents(Avatar)).toHaveLength(3)
    expect(w.text()).not.toContain('+')
  })

  it('超过 max 的部分折成 +N', () => {
    const w = group({ max: 2 }, ['甲', '乙', '丙', '丁', '戊'])
    expect(w.findAllComponents(Avatar)).toHaveLength(3)
    expect(w.text()).toContain('+3')
  })

  it('刚好等于 max 时不出现计数位', () => {
    const w = group({ max: 3 }, ['甲', '乙', '丙'])
    expect(w.text()).not.toContain('+')
  })

  it('v-for 产生的 fragment 子节点照样计数', () => {
    const w = mount(AvatarGroup, {
      props: { max: 2 },
      slots: {
        default: () => [
          h(Avatar, { name: '甲' }),
          ['乙', '丙', '丁'].map(name => h(Avatar, { key: name, name })),
        ],
      },
    })
    expect(w.text()).toContain('+2')
  })
})

describe('尺寸继承', () => {
  it('组的 size 透给子头像,子头像自己写的 size 优先', () => {
    const w = mount(AvatarGroup, {
      props: { size: 'lg' },
      slots: { default: () => [h(Avatar, { name: '甲' }), h(Avatar, { name: '乙', size: 'sm' })] },
    })
    const byName = (name: string) =>
      w.findAllComponents(Avatar).find(a => a.props('name') === name)!
    expect(byName('甲').classes()).toContain('size-10')
    expect(byName('乙').classes()).toContain('size-6')
  })
})
