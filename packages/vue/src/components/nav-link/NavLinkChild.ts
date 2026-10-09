import {
  Comment,
  defineComponent,
  h,
  mergeProps,
  Text,
  type PropType,
  type Slots,
  type VNode,
  type VNodeArrayChildren,
} from 'vue'
import { Primitive, type PrimitiveProps } from '../../primitives/primitive'
import { renderSlotFragments } from '../../primitives/utils/renderSlotFragments'

type Content = string | VNodeArrayChildren | null | undefined

const CHILDREN_FLAGS = 8 | 16 | 32

export default defineComponent({
  name: 'HnNavLinkChild',
  inheritAttrs: false,
  props: {
    as: { type: [String, Object] as PropType<PrimitiveProps['as']>, default: 'a' },
    labelProps: { type: Object as PropType<Record<string, unknown>>, required: true },
  },
  setup(props, { attrs, slots }) {
    const inner = (content: Content) => [
      ...(slots.icon?.() ?? []),
      h('span', props.labelProps, content ?? undefined),
    ]

    return () => {
      const children = renderSlotFragments(slots.default?.())
      const child = children.find(node => node.type !== Comment && node.type !== Text)
      if (!child) return h(Primitive, mergeProps(attrs, { as: props.as }), () => inner(children))

      const { ref: _, ...own } = child.props ?? {}
      const merged = mergeProps(attrs, own)
      const bare = {
        ...child,
        props: {},
        children: null,
        shapeFlag: child.shapeFlag & ~CHILDREN_FLAGS,
      } as VNode
      if (typeof child.type === 'string') return h(bare, merged, inner(child.children as Content))

      const given = (child.children ?? {}) as Slots
      const forwarded = Object.fromEntries(
        Object.entries(given).filter(([name]) => !name.startsWith('_') && name !== 'default'),
      )
      return h(bare, merged, {
        ...forwarded,
        default: (...args: unknown[]) => inner(given.default?.(...(args as [])) as Content),
      })
    }
  },
})
