import {
  computed,
  defineComponent,
  guardReactiveProps,
  h,
  mergeProps,
  normalizeProps,
  renderSlot,
  withCtx,
  type PropType,
} from 'vue'
import { isValueEqualOrExist } from '../../../../shared/src/primitives/value'
import { Primitive, type PrimitiveProps } from '../primitive'
import { RovingFocusItem } from '../roving-focus'
import { Toggle } from '../toggle'
import type { AcceptableValue } from '../utils/types'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useForwardScopeId } from '../utils/useForwardScopeId'
import { injectToggleGroupRootContext } from './context'

export interface ToggleGroupItemProps {
  value: AcceptableValue
  disabled?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const ToggleGroupItem = defineComponent({
  name: 'ToggleGroupItem',
  props: {
    value: { type: null as unknown as PropType<AcceptableValue>, required: true },
    disabled: { type: Boolean, required: false },
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'button',
    },
  },
  setup(props, { slots }) {
    const rootContext = injectToggleGroupRootContext()
    const disabled = computed(() => rootContext.disabled?.value || props.disabled)
    const pressed = computed(() => isValueEqualOrExist(rootContext.modelValue.value, props.value))
    const { forwardRef } = useForwardExpose()
    const scopeIdAttrs = useForwardScopeId()
    const onUpdate = () => rootContext.changeModelValue(props.value)

    return () =>
      h(
        rootContext.rovingFocus.value ? RovingFocusItem : Primitive,
        mergeProps(
          { 'as-child': '' },
          rootContext.rovingFocus.value
            ? { focusable: !disabled.value, active: pressed.value }
            : {},
        ),
        {
          default: withCtx(() => [
            h(
              Toggle,
              mergeProps(
                { ...scopeIdAttrs, ...props },
                {
                  ref: forwardRef,
                  disabled: disabled.value,
                  'model-value': pressed.value,
                  'onUpdate:modelValue': onUpdate,
                },
              ),
              {
                default: withCtx((slotProps: Record<string, unknown>) => [
                  renderSlot(slots, 'default', normalizeProps(guardReactiveProps(slotProps))),
                ]),
              },
            ),
          ]),
        },
      )
  },
})
