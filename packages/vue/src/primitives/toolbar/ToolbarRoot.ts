import { defineComponent, h, renderSlot, toRefs, withCtx, type PropType } from 'vue'
import type { Orientation } from '../../../../shared/src/primitives/roving-focus'
import { Primitive, type PrimitiveProps } from '../primitive'
import { RovingFocusGroup } from '../roving-focus'
import { useDirection, type Direction } from '../utils/useDirection'
import { useForwardExpose } from '../utils/useForwardExpose'
import { provideToolbarRootContext } from './context'

export interface ToolbarRootProps {
  orientation?: Orientation
  dir?: Direction
  loop?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const ToolbarRoot = defineComponent({
  name: 'ToolbarRoot',
  props: {
    orientation: { type: String as PropType<Orientation>, required: false, default: 'horizontal' },
    dir: { type: String as PropType<Direction>, required: false },
    loop: { type: Boolean, required: false },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  setup(props, { slots }) {
    const { orientation, dir: propDir } = toRefs(props)
    const dir = useDirection(propDir)
    const { forwardRef } = useForwardExpose()
    provideToolbarRootContext({ orientation, dir })

    return () =>
      h(
        RovingFocusGroup,
        { 'as-child': '', orientation: orientation.value, dir: dir.value, loop: props.loop },
        {
          default: withCtx(() => [
            h(
              Primitive,
              {
                ref: forwardRef,
                role: 'toolbar',
                'aria-orientation': orientation.value,
                'as-child': props.asChild,
                as: props.as,
              },
              { default: withCtx(() => [renderSlot(slots, 'default')]) },
            ),
          ]),
        },
      )
  },
})
