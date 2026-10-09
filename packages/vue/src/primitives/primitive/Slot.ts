import { cloneVNode, Comment, defineComponent, mergeProps } from 'vue'
import { renderSlotFragments } from '../utils/renderSlotFragments'

export const Slot = defineComponent({
  name: 'PrimitiveSlot',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => {
      if (!slots.default) return null
      const children = renderSlotFragments(slots.default())
      const index = children.findIndex(child => child.type !== Comment)
      if (index === -1) return children
      const first = children[index]!
      delete first.props?.ref
      const merged = first.props ? mergeProps(attrs, first.props) : attrs
      const cloned = cloneVNode({ ...first, props: {} }, merged)
      if (children.length === 1) return cloned
      children[index] = cloned
      return children
    }
  },
})
