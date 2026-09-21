import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { cn } from '../../lib/cn'
import Avatar from './Avatar.vue'
import AvatarGroup from './AvatarGroup.vue'
import { useAvatarGroup } from './context'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(() => {
  document.body.innerHTML = ''
})

const WrappedAvatar = defineComponent({
  inheritAttrs: false,
  props: { name: String },
  setup(props, { attrs }) {
    const group = useAvatarGroup()
    return () =>
      h(
        'span',
        {
          'data-wrapped-avatar': props.name,
          'data-group-size': group?.value.size,
          class: 'inline-flex rounded-full',
        },
        [h(Avatar, { ...attrs, class: cn(attrs.class), name: props.name })],
      )
  },
})

it.each([
  ['sm', 24, 6],
  ['md', 32, 8],
  ['lg', 40, 10],
] as const)(
  'styles the actual flex items for wrapped %s avatars in LTR and RTL',
  async (size, width, overlap) => {
    const w = mount(AvatarGroup, {
      props: { max: 2, size },
      slots: {
        default: () =>
          ['A', 'B', 'C'].map(name => h(WrappedAvatar, { name, class: 'caller-avatar' })),
      },
      attachTo: document.body,
    })
    mounted.push(w)
    for (const dir of ['ltr', 'rtl']) {
      w.element.setAttribute('dir', dir)
      const roots = [...w.element.children] as HTMLElement[]
      expect(roots).toHaveLength(3)
      expect(roots[0]!.textContent).toContain('+1')
      expect(roots.slice(1).map(el => el.dataset.wrappedAvatar)).toEqual(['B', 'A'])
      for (const [index, root] of roots.entries()) {
        const style = getComputedStyle(root)
        expect(style.marginInlineEnd).toBe(index === 0 ? '0px' : `-${overlap}px`)
        expect(style.boxShadow).toMatch(/0px 0px 0px 2px/)
        expect(root.getBoundingClientRect().width).toBe(width)
        expect(root.getBoundingClientRect().height).toBe(width)
        if (index > 0) {
          expect(root.dataset.groupSize).toBe(size)
          const inner = root.querySelector('.caller-avatar')!
          expect(getComputedStyle(inner).marginInlineEnd).toBe('0px')
          expect(getComputedStyle(inner).boxShadow).toBe('none')
        }
      }
      const boxes = roots.map(el => el.getBoundingClientRect()).sort((a, b) => a.left - b.left)
      for (let index = 1; index < boxes.length; index++)
        expect(boxes[index - 1]!.right - boxes[index]!.left).toBe(overlap)
      const front = roots.at(-1)!
      const box = front.getBoundingClientRect()
      const top = document.elementFromPoint(
        dir === 'ltr' ? box.right - 1 : box.left + 1,
        box.top + width / 2,
      )
      expect(front.contains(top)).toBe(true)
    }
    await w.setProps({ size: size === 'lg' ? 'sm' : 'lg' })
    expect(w.get('[data-wrapped-avatar]').attributes('data-group-size')).toBe(
      size === 'lg' ? 'sm' : 'lg',
    )
  },
)

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
