import { defineComponent, type PropType } from 'vue'
import type { DateFieldPart } from '../../../../shared/src/primitives/date/field'
import { useSegmentInput } from '../date-field/segmentInput'
import type { PrimitiveProps } from '../primitive'
import { injectTimeFieldRootContext } from './context'
import { TIME_FIELD_SEGMENT } from './TimeFieldRoot'

export interface TimeFieldInputProps {
  part: DateFieldPart
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const TimeFieldInput = defineComponent({
  name: 'TimeFieldInput',
  props: {
    part: { type: null as unknown as PropType<DateFieldPart>, required: true },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  setup(props, { slots }) {
    const rootContext = injectTimeFieldRootContext()
    const render = useSegmentInput(props, rootContext, {
      segment: () => ({ [TIME_FIELD_SEGMENT]: props.part }),
      snapOnFocusOut: true,
    })
    return () => render(slots)
  },
})
