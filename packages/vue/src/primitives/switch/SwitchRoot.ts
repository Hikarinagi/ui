import {
  computed,
  createCommentVNode,
  defineComponent,
  Fragment,
  h,
  mergeProps,
  renderSlot,
  toRefs,
  withCtx,
  withKeys,
  withModifiers,
  type PropType,
  type Ref,
} from 'vue'
import { nextCheckedValue } from '../../../../shared/src/primitives/checkbox'
import { getLabelText } from '../../../../shared/src/primitives/label'
import { Primitive, type PrimitiveProps } from '../primitive'
import { createContext } from '../utils/createContext'
import { useFormControl } from '../utils/useFormControl'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useForwardScopeId } from '../utils/useForwardScopeId'
import { useVModel } from '../utils/useVModel'
import { VisuallyHiddenInput } from '../visually-hidden'

export interface SwitchRootContext {
  checked: Ref<boolean>
  toggleCheck: () => void
  disabled: Ref<boolean>
}

export const [injectSwitchRootContext, provideSwitchRootContext] =
  createContext<SwitchRootContext>('SwitchRoot')

export interface SwitchRootProps {
  defaultValue?: unknown
  modelValue?: unknown
  disabled?: boolean
  id?: string
  value?: string
  trueValue?: unknown
  falseValue?: unknown
  asChild?: boolean
  as?: PrimitiveProps['as']
  name?: string
  required?: boolean
}

export const SwitchRoot = defineComponent({
  name: 'SwitchRoot',
  inheritAttrs: false,
  props: {
    defaultValue: { type: null as unknown as PropType<unknown>, required: false },
    modelValue: { type: null as unknown as PropType<unknown>, required: false },
    disabled: { type: Boolean, required: false },
    id: { type: String, required: false },
    value: { type: String, required: false, default: 'on' },
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
    const { disabled } = toRefs(props)
    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue ?? props.falseValue,
      passive: props.modelValue === undefined,
    })
    const checked = computed(() => modelValue.value === props.trueValue)
    function toggleCheck() {
      if (disabled.value) return
      modelValue.value = nextCheckedValue(
        undefined,
        checked.value,
        props.trueValue,
        props.falseValue,
      )
    }
    const { forwardRef, currentElement } = useForwardExpose()
    const isFormControl = useFormControl(currentElement)
    const scopeIdAttrs = useForwardScopeId()
    const ariaLabel = computed(() => getLabelText(props.id, currentElement.value))

    provideSwitchRootContext({ checked, toggleCheck, disabled })

    return () =>
      h(Fragment, null, [
        h(
          Primitive,
          mergeProps(
            {
              id: props.id,
              ref: forwardRef,
              role: 'switch',
              type: props.as === 'button' ? 'button' : undefined,
              value: props.value,
              'aria-label': attrs['aria-label'] || ariaLabel.value,
              'aria-checked': checked.value,
              'aria-required': props.required,
              'data-state': checked.value ? 'checked' : 'unchecked',
              'data-disabled': disabled.value ? '' : undefined,
              'as-child': props.asChild,
              as: props.as,
              disabled: disabled.value,
            },
            { ...scopeIdAttrs, ...attrs },
            {
              onClick: toggleCheck,
              onKeydown: withKeys(withModifiers(toggleCheck, ['prevent']), ['enter']),
            },
          ),
          {
            default: withCtx(() => [
              renderSlot(slots, 'default', {
                modelValue: modelValue.value,
                checked: checked.value,
              }),
            ]),
          },
        ),
        isFormControl.value && props.name
          ? h(
              VisuallyHiddenInput,
              mergeProps(
                {
                  key: 0,
                  type: 'checkbox',
                  name: props.name,
                  disabled: disabled.value,
                  required: props.required,
                  value: props.value,
                  checked: checked.value,
                },
                scopeIdAttrs,
              ) as { name: string; value: unknown },
            )
          : createCommentVNode('v-if', true),
      ])
  },
})
