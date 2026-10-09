import {
  computed,
  defineComponent,
  h,
  mergeProps,
  ref,
  renderSlot,
  toRefs,
  watch,
  withCtx,
  type PropType,
} from 'vue'
import {
  isPinInputComplete,
  pinInputValues,
  type PinInputValue,
} from '../../../../shared/src/primitives/pin-input'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useDirection, type Direction } from '../utils/useDirection'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useVModel } from '../utils/useVModel'
import { VisuallyHiddenInput } from '../visually-hidden'
import { providePinInputRootContext, type PinInputType } from './context'

export interface PinInputRootProps {
  modelValue?: PinInputValue | null
  defaultValue?: PinInputValue
  placeholder?: string
  mask?: boolean
  otp?: boolean
  type?: PinInputType
  dir?: Direction
  disabled?: boolean
  id?: string
  asChild?: boolean
  as?: PrimitiveProps['as']
  name?: string
  required?: boolean
}

export type PinInputRootEmits = {
  'update:modelValue': [value: PinInputValue]
  complete: [value: PinInputValue]
}

export const PinInputRoot = defineComponent({
  name: 'PinInputRoot',
  inheritAttrs: false,
  props: {
    modelValue: { type: null as unknown as PropType<PinInputValue | null>, required: false },
    defaultValue: { type: null as unknown as PropType<PinInputValue>, required: false },
    placeholder: { type: String, required: false, default: '' },
    mask: { type: Boolean, required: false },
    otp: { type: Boolean, required: false },
    type: { type: null as unknown as PropType<PinInputType>, required: false, default: 'text' },
    dir: { type: String as PropType<Direction>, required: false },
    disabled: { type: Boolean, required: false },
    id: { type: String, required: false },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
    name: { type: String, required: false },
    required: { type: Boolean, required: false },
  },
  emits: ['update:modelValue', 'complete'],
  setup(props, { emit, attrs, slots }) {
    const { mask, otp, placeholder, type, disabled, dir: propDir } = toRefs(props)
    const { forwardRef } = useForwardExpose()
    const dir = useDirection(propDir)
    const modelValue = useVModel(
      props,
      'modelValue',
      (_, value) => emit('update:modelValue', value as PinInputValue),
      { defaultValue: props.defaultValue ?? [], passive: true },
    )
    const currentModelValue = computed(() => pinInputValues(modelValue.value))
    const inputElements = ref(new Set<HTMLInputElement>())
    function onInputElementChange(element: HTMLInputElement) {
      inputElements.value.add(element)
    }
    const isNumericMode = computed(() => props.type === 'number')
    const isCompleted = computed(() =>
      isPinInputComplete(currentModelValue.value, inputElements.value.size, isNumericMode.value),
    )
    watch(
      modelValue,
      () => {
        if (isCompleted.value) emit('complete', modelValue.value as PinInputValue)
      },
      { deep: true },
    )

    providePinInputRootContext({
      modelValue: modelValue as never,
      currentModelValue,
      mask,
      otp,
      placeholder,
      type,
      dir,
      disabled,
      isCompleted,
      inputElements: inputElements as never,
      onInputElementChange,
      isNumericMode,
    })

    const onFocus = () => Array.from(inputElements.value)?.[0]?.focus()

    return () =>
      h(
        Primitive,
        mergeProps(attrs, {
          ref: forwardRef,
          dir: dir.value,
          'data-complete': isCompleted.value ? '' : undefined,
          'data-disabled': disabled.value ? '' : undefined,
        }),
        {
          default: withCtx(() => [
            renderSlot(slots, 'default', { modelValue: modelValue.value }),
            h(VisuallyHiddenInput, {
              id: props.id,
              as: 'input',
              feature: 'focusable',
              tabindex: '-1',
              value: currentModelValue.value.join(''),
              name: props.name ?? '',
              disabled: disabled.value,
              required: props.required,
              onFocus,
            }),
          ]),
        },
      )
  },
})
