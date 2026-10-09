import { defineComponent, h, renderSlot, toRefs, withCtx, type PropType } from 'vue'
import type { SingleOrMultipleType } from '../../../../shared/src/primitives/value'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useDirection, type Direction } from '../utils/useDirection'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useSingleOrMultipleValue } from '../utils/useSingleOrMultipleValue'
import { provideAccordionRootContext, type AccordionOrientation } from './context'

export interface AccordionRootProps {
  collapsible?: boolean
  disabled?: boolean
  dir?: Direction
  orientation?: AccordionOrientation
  unmountOnHide?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
  type?: SingleOrMultipleType
  modelValue?: string | string[]
  defaultValue?: string | string[]
}

export type AccordionRootEmits = {
  'update:modelValue': [value: string | string[] | undefined]
}

export const AccordionRoot = defineComponent({
  name: 'AccordionRoot',
  props: {
    collapsible: { type: Boolean, required: false, default: false },
    disabled: { type: Boolean, required: false, default: false },
    dir: { type: String as PropType<Direction>, required: false },
    orientation: {
      type: String as PropType<AccordionOrientation>,
      required: false,
      default: 'vertical',
    },
    unmountOnHide: { type: Boolean, required: false, default: true },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
    type: { type: String as PropType<SingleOrMultipleType>, required: false },
    modelValue: { type: null as unknown as PropType<string | string[]>, required: false },
    defaultValue: { type: null as unknown as PropType<string | string[]>, required: false },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const { dir, disabled, unmountOnHide } = toRefs(props)
    const direction = useDirection(dir)
    const { modelValue, changeModelValue, isSingle } = useSingleOrMultipleValue<
      string,
      typeof props
    >(props, emit as never)
    const { forwardRef, currentElement: parentElement } = useForwardExpose()

    provideAccordionRootContext({
      disabled,
      direction,
      orientation: props.orientation,
      parentElement,
      isSingle,
      collapsible: props.collapsible,
      modelValue: modelValue as never,
      changeModelValue,
      unmountOnHide,
    })

    return () =>
      h(
        Primitive,
        { ref: forwardRef, 'as-child': props.asChild, as: props.as },
        {
          default: withCtx(() => [renderSlot(slots, 'default', { modelValue: modelValue.value })]),
        },
      )
  },
})
