import { defineComponent, h, mergeProps, renderSlot, withCtx, type PropType } from 'vue'
import type { Orientation } from '../../../../shared/src/primitives/roving-focus'
import type { SingleOrMultipleType } from '../../../../shared/src/primitives/value'
import type { PrimitiveProps } from '../primitive'
import { ToggleGroupRoot } from '../toggle-group'
import type { AcceptableValue } from '../utils/types'
import type { Direction } from '../utils/useDirection'
import { useEmitAsProps } from '../utils/useEmitAsProps'
import { useForwardExpose } from '../utils/useForwardExpose'
import { injectToolbarRootContext } from './context'

type ToolbarToggleGroupValue = AcceptableValue | AcceptableValue[]

export interface ToolbarToggleGroupProps {
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
  modelValue?: ToolbarToggleGroupValue
  defaultValue?: ToolbarToggleGroupValue
}

export type ToolbarToggleGroupEmits = {
  'update:modelValue': [value: ToolbarToggleGroupValue]
}

export const ToolbarToggleGroup = defineComponent({
  name: 'ToolbarToggleGroup',
  props: {
    rovingFocus: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
    orientation: { type: String as PropType<Orientation>, required: false },
    dir: { type: String as PropType<Direction>, required: false },
    loop: { type: Boolean, required: false },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
    name: { type: String, required: false },
    required: { type: Boolean, required: false },
    type: { type: String as PropType<SingleOrMultipleType>, required: false },
    modelValue: { type: null as unknown as PropType<ToolbarToggleGroupValue>, required: false },
    defaultValue: { type: null as unknown as PropType<ToolbarToggleGroupValue>, required: false },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const rootContext = injectToolbarRootContext()
    const emitsAsProps = useEmitAsProps(emit as (name: 'update:modelValue') => void)
    useForwardExpose()

    return () =>
      h(
        ToggleGroupRoot,
        mergeProps(
          { ...props, ...emitsAsProps },
          {
            'data-orientation': rootContext.orientation.value,
            dir: rootContext.dir.value,
            'roving-focus': false,
          },
        ),
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})
