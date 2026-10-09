import {
  computed,
  createCommentVNode,
  defineComponent,
  Fragment,
  h,
  mergeProps,
  renderSlot,
  withCtx,
  withKeys,
  withModifiers,
  type PropType,
} from 'vue'
import {
  ariaChecked,
  getCheckedState,
  nextCheckedValue,
  type CheckedState,
} from '../../../../shared/src/primitives/checkbox'
import { getLabelText } from '../../../../shared/src/primitives/label'
import {
  isEqual,
  isValueEqualOrExist,
  toggleArrayValue,
} from '../../../../shared/src/primitives/value'
import { Primitive, type PrimitiveProps } from '../primitive'
import { RovingFocusItem } from '../roving-focus'
import { useFormControl } from '../utils/useFormControl'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useForwardScopeId } from '../utils/useForwardScopeId'
import { useVModel } from '../utils/useVModel'
import { VisuallyHiddenInput } from '../visually-hidden'
import { injectCheckboxGroupRootContext, provideCheckboxRootContext } from './context'

export interface CheckboxRootProps {
  defaultValue?: unknown
  modelValue?: unknown
  disabled?: boolean
  value?: unknown
  id?: string
  trueValue?: unknown
  falseValue?: unknown
  asChild?: boolean
  as?: PrimitiveProps['as']
  name?: string
  required?: boolean
}

export const CheckboxRoot = defineComponent({
  name: 'CheckboxRoot',
  inheritAttrs: false,
  props: {
    defaultValue: { type: null as unknown as PropType<unknown>, required: false },
    modelValue: { type: null as unknown as PropType<unknown>, required: false },
    disabled: { type: Boolean, required: false },
    value: { type: null as unknown as PropType<unknown>, required: false, default: 'on' },
    id: { type: String, required: false },
    trueValue: { type: null as unknown as PropType<unknown>, required: false, default: () => true },
    falseValue: {
      type: null as unknown as PropType<unknown>,
      required: false,
      default: () => false,
    },
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
    const checkboxGroupContext = injectCheckboxGroupRootContext(null)
    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue ?? props.falseValue,
      passive: props.modelValue === undefined,
    })
    const disabled = computed(() => checkboxGroupContext?.disabled.value || props.disabled)
    const isChecked = computed(() => isEqual(modelValue.value, props.trueValue))
    const inGroup = () => checkboxGroupContext?.modelValue.value != null
    const checkboxState = computed<CheckedState>(() => {
      if (inGroup()) return isValueEqualOrExist(checkboxGroupContext!.modelValue.value, props.value)
      if (modelValue.value === 'indeterminate') return 'indeterminate'
      return isChecked.value
    })

    function handleClick() {
      if (inGroup())
        checkboxGroupContext!.modelValue.value = toggleArrayValue(
          checkboxGroupContext!.modelValue.value || [],
          props.value,
        )
      else
        modelValue.value = nextCheckedValue(
          modelValue.value,
          isChecked.value,
          props.trueValue,
          props.falseValue,
        )
    }

    const isFormControl = useFormControl(currentElement)
    const scopeIdAttrs = useForwardScopeId()
    const ariaLabel = computed(() =>
      attrs['aria-label'] ? undefined : getLabelText(props.id, currentElement.value),
    )

    provideCheckboxRootContext({ disabled, state: checkboxState })

    return () => {
      const rovingFocus = checkboxGroupContext?.rovingFocus.value
      return h(Fragment, null, [
        h(
          rovingFocus ? RovingFocusItem : Primitive,
          mergeProps(
            { ...attrs, ...scopeIdAttrs },
            {
              id: props.id,
              ref: forwardRef,
              role: 'checkbox',
              'as-child': props.asChild,
              as: props.as,
              type: props.as === 'button' ? 'button' : undefined,
              'aria-checked': ariaChecked(checkboxState.value),
              'aria-required': props.required,
              'aria-label': attrs['aria-label'] || ariaLabel.value,
              'data-state': getCheckedState(checkboxState.value),
              'data-disabled': disabled.value ? '' : undefined,
              disabled: disabled.value,
              focusable: rovingFocus ? !disabled.value : undefined,
              onKeydown: withKeys(
                withModifiers(() => {}, ['prevent']),
                ['enter'],
              ),
              onClick: handleClick,
            },
          ),
          {
            default: withCtx(() => [
              renderSlot(slots, 'default', {
                modelValue: modelValue.value,
                state: checkboxState.value,
              }),
            ]),
          },
        ),
        isFormControl.value && props.name && !checkboxGroupContext
          ? h(
              VisuallyHiddenInput,
              mergeProps(
                {
                  key: 0,
                  type: 'checkbox',
                  checked: !!checkboxState.value,
                  name: props.name,
                  value: props.value,
                  disabled: disabled.value,
                  required: props.required,
                },
                scopeIdAttrs,
              ) as { name: string; value: unknown },
            )
          : createCommentVNode('v-if', true),
      ])
    }
  },
})
