import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import Avatar from './Avatar.vue'
import AvatarGroup from './AvatarGroup.vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function mountGroup(props: Record<string, unknown>, names: string[]) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const w = mount(
    defineComponent({
      setup: () => () =>
        h('div', { style: 'padding: 40px' }, [
          h(AvatarGroup, props, {
            default: () => names.map(name => h(Avatar, { key: name, name })),
          }),
        ]),
    }),
    { attachTo: host },
  )
  mounted.push(w)
  return w
}

const circles = () => [...document.querySelectorAll('span[class*="rounded-full"]')] as HTMLElement[]

describe('avatar group · 叠放', () => {
  it('相邻头像互相重叠,首位不留负边距', () => {
    mountGroup({}, ['甲', '乙', '丙'])
    const boxes = circles().map(el => el.getBoundingClientRect())
    expect(boxes).toHaveLength(3)
    const sorted = [...boxes].sort((a, b) => a.left - b.left)
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i]!.left).toBeLessThan(sorted[i - 1]!.right)
    }
  })

  it('每个头像带 2px 的环,颜色取自卡面', () => {
    mountGroup({}, ['甲', '乙'])
    const shadow = getComputedStyle(circles()[0]!).boxShadow
    expect(shadow).toMatch(/0px 0px 0px 2px/)
    const surface = getComputedStyle(document.documentElement).getPropertyValue('--hn-surface')
    expect(surface.trim()).not.toBe('')
  })

  it('靠前的头像压在靠后的之上', () => {
    mountGroup({}, ['甲', '乙'])
    const [first, second] = circles().sort(
      (a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left,
    )
    const box = first!.getBoundingClientRect()
    const overlap = document.elementFromPoint(box.right - 2, box.top + box.height / 2)
    expect(first!.contains(overlap)).toBe(true)
    expect(second!.contains(overlap)).toBe(false)
  })
})
