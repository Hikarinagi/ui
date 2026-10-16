import {
  defineComponent,
  guardReactiveProps,
  h,
  normalizeProps,
  renderSlot,
  withCtx,
  type Component,
} from 'vue'
import { useEmitAsProps } from '../utils/useEmitAsProps'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useForwardPropsEmits } from '../utils/useForwardPropsEmits'

export type WrapMode = 'props' | 'emits' | 'forwarded'

export function wrapMenuPart(
  name: string,
  target: Component,
  props: Record<string, object>,
  options: { emits?: string[]; mode?: WrapMode; expose?: boolean } = {},
) {
  const { emits = [], mode = 'props', expose = true } = options
  return defineComponent({
    name,
    props,
    emits,
    setup(rawProps, { emit, slots }) {
      const emitter = emit as (name: string) => void
      const emitsAsProps = mode === 'emits' ? useEmitAsProps(emitter) : {}
      const forwarded = mode === 'forwarded' ? useForwardPropsEmits(rawProps, emitter) : undefined
      if (expose) useForwardExpose()
      return () =>
        h(
          target,
          normalizeProps(
            guardReactiveProps(
              mode === 'forwarded'
                ? forwarded!.value
                : mode === 'emits'
                  ? { ...rawProps, ...emitsAsProps }
                  : rawProps,
            ),
          ),
          {
            default: withCtx((slotProps: Record<string, unknown>) => [
              renderSlot(slots, 'default', slotProps),
            ]),
          },
        )
    },
  })
}
