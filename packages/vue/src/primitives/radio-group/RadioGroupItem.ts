import {
  computed,
  defineComponent,
  h,
  mergeProps,
  onScopeDispose,
  renderSlot,
  withCtx,
  withKeys,
  withModifiers,
  type PropType,
} from 'vue'
import { trackArrowKeys } from '../../../../shared/src/primitives/radio-group'
import { isEqual } from '../../../../shared/src/primitives/value'
import type { PrimitiveProps } from '../primitive'
import { RovingFocusItem } from '../roving-focus'
import type { AcceptableValue } from '../utils/types'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useForwardScopeId } from '../utils/useForwardScopeId'
import { injectRadioGroupRootContext, provideRadioGroupItemContext } from './context'
import { Radio } from './Radio'

export interface RadioGroupItemProps {
  id?: string
  value?: AcceptableValue
  disabled?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
  name?: string
  required?: boolean
}

export const RadioGroupItem = defineComponent({
  name: 'RadioGroupItem',
  inheritAttrs: false,
  props: {
    id: { type: String, required: false },
    value: { type: null as unknown as PropType<AcceptableValue>, required: false },
    disabled: { type: Boolean, required: false, default: false },
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'button',
    },
    name: { type: String, required: false },
    required: { type: Boolean, required: false },
  },
  emits: ['select'],
  setup(props, { emit, attrs, slots }) {
    const { forwardRef, currentElement } = useForwardExpose()
    const rootContext = injectRadioGroupRootContext()
    const disabled = computed(() => rootContext.disabled.value || props.disabled)
    const required = computed(() => rootContext.required.value || props.required)
    const checked = computed(() => isEqual(rootContext.modelValue?.value, props.value))
    provideRadioGroupItemContext({ disabled, checked })

    const arrowKeys = typeof window === 'undefined' ? undefined : trackArrowKeys(window)
    onScopeDispose(() => arrowKeys?.dispose())

    function handleFocus() {
      setTimeout(() => {
        if (arrowKeys?.pressed) currentElement.value?.click()
      }, 0)
    }

    const scopeIdAttrs = useForwardScopeId()
    const onUpdateChecked = () => rootContext.changeModelValue(props.value)
    const onSelect = (event: Event) => emit('select', event)
    const onKeydown = withKeys(
      withModifiers(() => {}, ['prevent']),
      ['enter'],
    )

    return () =>
      h(
        RovingFocusItem,
        {
          checked: checked.value,
          disabled: disabled.value,
          'as-child': '',
          focusable: !disabled.value,
          active: checked.value,
        },
        {
          default: withCtx(() => [
            h(
              Radio,
              mergeProps(
                { ...scopeIdAttrs, ...attrs, ...props },
                {
                  ref: forwardRef,
                  checked: checked.value,
                  required: required.value,
                  disabled: disabled.value,
                  'onUpdate:checked': onUpdateChecked,
                  onSelect,
                  onKeydown,
                  onFocus: handleFocus,
                },
              ),
              {
                default: withCtx(() => [
                  renderSlot(slots, 'default', {
                    checked: checked.value,
                    required: required.value,
                    disabled: disabled.value,
                  }),
                ]),
              },
            ),
          ]),
        },
      )
  },
})
