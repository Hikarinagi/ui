import { defineComponent, h, renderSlot, toRefs, withCtx, type PropType } from 'vue'
import { Primitive, type PrimitiveProps } from '../primitive'
import { RovingFocusGroup } from '../roving-focus'
import { useForwardExpose } from '../utils/useForwardExpose'
import { injectTabsRootContext } from './context'

export interface TabsListProps {
  loop?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const TabsList = defineComponent({
  name: 'TabsList',
  props: {
    loop: { type: Boolean, required: false, default: true },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  setup(props, { slots }) {
    const { loop } = toRefs(props)
    const { forwardRef, currentElement } = useForwardExpose()
    const context = injectTabsRootContext()
    context.tabsList = currentElement

    return () =>
      h(
        RovingFocusGroup,
        {
          'as-child': '',
          orientation: context.orientation.value,
          dir: context.dir.value,
          loop: loop.value,
        },
        {
          default: withCtx(() => [
            h(
              Primitive,
              {
                ref: forwardRef,
                role: 'tablist',
                'as-child': props.asChild,
                as: props.as,
                'aria-orientation': context.orientation.value,
              },
              { default: withCtx(() => [renderSlot(slots, 'default')]) },
            ),
          ]),
        },
      )
  },
})
