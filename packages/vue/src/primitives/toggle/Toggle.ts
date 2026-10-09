import {
  computed,
  createCommentVNode,
  defineComponent,
  Fragment,
  h,
  mergeProps,
  renderSlot,
  withCtx,
  type PropType,
} from 'vue'
import { toggleState } from '../../../../shared/src/primitives/toggle'
import { Primitive, type PrimitiveProps } from '../primitive'
import { injectToggleGroupRootContext } from '../toggle-group/context'
import { useFormControl } from '../utils/useFormControl'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useForwardScopeId } from '../utils/useForwardScopeId'
import { useVModel } from '../utils/useVModel'
import { VisuallyHiddenInput } from '../visually-hidden'

export interface ToggleProps {
  defaultValue?: boolean
  modelValue?: boolean | null
  disabled?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
  name?: string
  required?: boolean
}

export type ToggleEmits = {
  'update:modelValue': [value: boolean]
}

export const Toggle = defineComponent({
  name: 'Toggle',
  inheritAttrs: false,
  props: {
    defaultValue: { type: Boolean, required: false },
    modelValue: {
      type: [Boolean, null] as PropType<boolean | null>,
      required: false,
      default: undefined,
    },
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
  emits: ['update:modelValue'],
  setup(props, { emit, attrs, slots }) {
    const { forwardRef, currentElement } = useForwardExpose()
    const scopeIdAttrs = useForwardScopeId()
    const toggleGroupContext = injectToggleGroupRootContext(null)
    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue,
      passive: props.modelValue === undefined,
    })
    function togglePressed() {
      modelValue.value = !modelValue.value
    }
    const dataState = computed(() => toggleState(modelValue.value))
    const isFormControl = useFormControl(currentElement)

    return () =>
      h(Fragment, null, [
        h(
          Primitive,
          mergeProps(
            {
              ref: forwardRef,
              type: props.as === 'button' ? 'button' : undefined,
              'as-child': props.asChild,
              as: props.as,
              'aria-pressed': modelValue.value,
              'data-state': dataState.value,
              'data-disabled': props.disabled ? '' : undefined,
              disabled: props.disabled,
            },
            { ...scopeIdAttrs, ...attrs },
            { onClick: togglePressed },
          ),
          {
            default: withCtx(() => [
              renderSlot(slots, 'default', {
                modelValue: modelValue.value,
                disabled: props.disabled,
                pressed: modelValue.value,
                state: dataState.value,
              }),
            ]),
          },
        ),
        isFormControl.value && props.name && !toggleGroupContext
          ? h(
              VisuallyHiddenInput,
              mergeProps(
                {
                  key: 0,
                  type: 'checkbox',
                  name: props.name,
                  value: modelValue.value,
                  required: props.required,
                },
                scopeIdAttrs,
              ) as { name: string; value: unknown },
            )
          : createCommentVNode('v-if', true),
      ])
  },
})
