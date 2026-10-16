import { defineComponent, type PropType } from 'vue'
import type { DateFieldPart } from '../../../../shared/src/primitives/date/field'
import { DATE_FIELD_SEGMENT } from '../date-field/DateFieldRoot'
import { useSegmentInput } from '../date-field/segmentInput'
import type { PrimitiveProps } from '../primitive'
import { injectDateRangeFieldRootContext, type DateRangeType } from './context'

export const DATE_RANGE_FIELD_SEGMENT_TYPE = 'data-reka-date-range-field-segment-type'

export interface DateRangeFieldInputProps {
  part: DateFieldPart
  type: DateRangeType
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const DateRangeFieldInput = defineComponent({
  name: 'DateRangeFieldInput',
  props: {
    part: { type: null as unknown as PropType<DateFieldPart>, required: true },
    type: { type: String as PropType<DateRangeType>, required: true },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  setup(props, { slots }) {
    const rootContext = injectDateRangeFieldRootContext()
    const render = useSegmentInput(
      props,
      {
        ...rootContext,
        segmentValues: rootContext.segmentValues[props.type],
        modelValue: props.type === 'start' ? rootContext.startValue : rootContext.endValue,
      },
      {
        segment: () => ({ [DATE_FIELD_SEGMENT]: props.part }),
        extra: () => ({ [DATE_RANGE_FIELD_SEGMENT_TYPE]: props.type }),
        snapOnFocusOut: false,
      },
    )
    return () => render(slots)
  },
})
