import {
  computed,
  createCommentVNode,
  defineComponent,
  h,
  mergeProps,
  renderSlot,
  toRefs,
  withCtx,
  type PropType,
} from 'vue'
import type { Orientation } from '../../../../shared/src/primitives/roving-focus'
import { Primitive, type PrimitiveProps } from '../primitive'
import { RovingFocusGroup } from '../roving-focus'
import { useDirection, type Direction } from '../utils/useDirection'
import { useFormControl } from '../utils/useFormControl'
import { usePrimitiveElement } from '../utils/usePrimitiveElement'
import { useVModel } from '../utils/useVModel'
import { VisuallyHiddenInput } from '../visually-hidden'
import { provideCheckboxGroupRootContext } from './context'

export interface CheckboxGroupRootProps {
  defaultValue?: unknown[]
  modelValue?: unknown[]
  rovingFocus?: boolean
  disabled?: boolean
  as?: PrimitiveProps['as']
  asChild?: boolean
  dir?: Direction
  orientation?: Orientation
  loop?: boolean
  name?: string
  required?: boolean
}

export const CheckboxGroupRoot = defineComponent({
  name: 'CheckboxGroupRoot',
  props: {
    defaultValue: { type: Array as PropType<unknown[]>, required: false },
    modelValue: { type: Array as PropType<unknown[]>, required: false },
    rovingFocus: { type: Boolean, required: false, default: true },
    disabled: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
    asChild: { type: Boolean, required: false },
    dir: { type: String as PropType<Direction>, required: false },
    orientation: { type: String as PropType<Orientation>, required: false },
    loop: { type: Boolean, required: false },
    name: { type: String, required: false },
    required: { type: Boolean, required: false },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const { disabled, rovingFocus, dir: propDir } = toRefs(props)
    const dir = useDirection(propDir)
    const { primitiveElement, currentElement } = usePrimitiveElement()
    const isFormControl = useFormControl(currentElement)
    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue ?? [],
      passive: props.modelValue === undefined,
    })
    const rovingFocusProps = computed(() =>
      rovingFocus.value ? { loop: props.loop, dir: dir.value, orientation: props.orientation } : {},
    )

    provideCheckboxGroupRootContext({
      modelValue: modelValue as never,
      rovingFocus,
      disabled,
    })

    return () =>
      h(
        rovingFocus.value ? RovingFocusGroup : Primitive,
        mergeProps(
          { ref: primitiveElement, as: props.as, 'as-child': props.asChild },
          rovingFocusProps.value,
        ),
        {
          default: withCtx(() => [
            renderSlot(slots, 'default'),
            isFormControl.value && props.name
              ? h(VisuallyHiddenInput, {
                  key: 0,
                  name: props.name,
                  value: modelValue.value,
                  required: props.required,
                })
              : createCommentVNode('v-if', true),
          ]),
        },
      )
  },
})
