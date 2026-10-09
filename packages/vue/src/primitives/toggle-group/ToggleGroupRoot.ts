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
import type { SingleOrMultipleType } from '../../../../shared/src/primitives/value'
import { Primitive, type PrimitiveProps } from '../primitive'
import { RovingFocusGroup } from '../roving-focus'
import type { AcceptableValue } from '../utils/types'
import { useDirection, type Direction } from '../utils/useDirection'
import { useFormControl } from '../utils/useFormControl'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useSingleOrMultipleValue } from '../utils/useSingleOrMultipleValue'
import { VisuallyHiddenInput } from '../visually-hidden'
import { provideToggleGroupRootContext } from './context'

type ToggleGroupValue = AcceptableValue | AcceptableValue[]

export interface ToggleGroupRootProps {
  rovingFocus?: boolean
  disabled?: boolean
  orientation?: Orientation
  dir?: Direction
  loop?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
  name?: string
  required?: boolean
  type?: SingleOrMultipleType
  modelValue?: ToggleGroupValue
  defaultValue?: ToggleGroupValue
}

export type ToggleGroupRootEmits = {
  'update:modelValue': [value: ToggleGroupValue]
}

export const ToggleGroupRoot = defineComponent({
  name: 'ToggleGroupRoot',
  props: {
    rovingFocus: { type: Boolean, required: false, default: true },
    disabled: { type: Boolean, required: false, default: false },
    orientation: { type: String as PropType<Orientation>, required: false },
    dir: { type: String as PropType<Direction>, required: false },
    loop: { type: Boolean, required: false, default: true },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
    name: { type: String, required: false },
    required: { type: Boolean, required: false },
    type: { type: String as PropType<SingleOrMultipleType>, required: false },
    modelValue: { type: null as unknown as PropType<ToggleGroupValue>, required: false },
    defaultValue: { type: null as unknown as PropType<ToggleGroupValue>, required: false },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const { loop, rovingFocus, disabled, dir: propDir } = toRefs(props)
    const dir = useDirection(propDir)
    const { forwardRef, currentElement } = useForwardExpose()
    const { modelValue, changeModelValue, isSingle } = useSingleOrMultipleValue<
      AcceptableValue,
      typeof props
    >(props, emit as never)
    const isFormControl = useFormControl(currentElement)

    provideToggleGroupRootContext({
      isSingle,
      modelValue,
      changeModelValue,
      dir,
      orientation: props.orientation,
      loop,
      rovingFocus,
      disabled,
    })

    return () =>
      h(
        rovingFocus.value ? RovingFocusGroup : Primitive,
        {
          'as-child': '',
          orientation: rovingFocus.value ? props.orientation : undefined,
          dir: dir.value,
          loop: rovingFocus.value ? loop.value : undefined,
        },
        {
          default: withCtx(() => [
            h(
              Primitive,
              { ref: forwardRef, role: 'group', 'as-child': props.asChild, as: props.as },
              {
                default: withCtx(() => [
                  renderSlot(slots, 'default', { modelValue: modelValue.value }),
                  isFormControl.value && props.name
                    ? h(VisuallyHiddenInput, {
                        key: 0,
                        name: props.name,
                        required: props.required,
                        value: modelValue.value,
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
