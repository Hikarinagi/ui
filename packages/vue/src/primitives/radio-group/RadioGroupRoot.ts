import {
  createCommentVNode,
  defineComponent,
  h,
  renderSlot,
  toRefs,
  withCtx,
  type PropType,
} from 'vue'
import type { Orientation } from '../../../../shared/src/primitives/roving-focus'
import { Primitive, type PrimitiveProps } from '../primitive'
import { RovingFocusGroup } from '../roving-focus'
import type { AcceptableValue } from '../utils/types'
import { useDirection, type Direction } from '../utils/useDirection'
import { useFormControl } from '../utils/useFormControl'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useVModel } from '../utils/useVModel'
import { VisuallyHiddenInput } from '../visually-hidden'
import { provideRadioGroupRootContext } from './context'

export interface RadioGroupRootProps {
  modelValue?: AcceptableValue
  defaultValue?: AcceptableValue
  disabled?: boolean
  orientation?: Orientation
  dir?: Direction
  loop?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
  name?: string
  required?: boolean
}

export const RadioGroupRoot = defineComponent({
  name: 'RadioGroupRoot',
  props: {
    modelValue: { type: null as unknown as PropType<AcceptableValue>, required: false },
    defaultValue: { type: null as unknown as PropType<AcceptableValue>, required: false },
    disabled: { type: Boolean, required: false, default: false },
    orientation: { type: String as PropType<Orientation>, required: false, default: undefined },
    dir: { type: String as PropType<Direction>, required: false },
    loop: { type: Boolean, required: false, default: true },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
    name: { type: String, required: false },
    required: { type: Boolean, required: false, default: false },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const { forwardRef, currentElement } = useForwardExpose()
    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue,
      passive: props.modelValue === undefined,
    })
    const { disabled, loop, orientation, name, required, dir: propDir } = toRefs(props)
    const dir = useDirection(propDir)
    const isFormControl = useFormControl(currentElement)

    provideRadioGroupRootContext({
      modelValue,
      changeModelValue: value => {
        modelValue.value = value as AcceptableValue
      },
      disabled,
      loop,
      orientation,
      name: name?.value,
      required,
    })

    return () =>
      h(
        RovingFocusGroup,
        { 'as-child': '', orientation: orientation.value, dir: dir.value, loop: loop.value },
        {
          default: withCtx(() => [
            h(
              Primitive,
              {
                ref: forwardRef,
                role: 'radiogroup',
                'data-disabled': disabled.value ? '' : undefined,
                'as-child': props.asChild,
                as: props.as,
                'aria-orientation': orientation.value,
                'aria-required': required.value,
                dir: dir.value,
              },
              {
                default: withCtx(() => [
                  renderSlot(slots, 'default', { modelValue: modelValue.value }),
                  isFormControl.value && name.value
                    ? h(VisuallyHiddenInput, {
                        key: 0,
                        required: required.value,
                        disabled: disabled.value,
                        value: modelValue.value,
                        name: name.value,
                      })
                    : createCommentVNode('v-if', true),
                ]),
              },
            ),
          ]),
        },
      )
  },
})
