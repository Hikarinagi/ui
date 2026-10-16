import { defineComponent, type PropType } from 'vue'
import type { DateFieldPart } from '../../../../shared/src/primitives/date/field'
import type { PrimitiveProps } from '../primitive'
import { injectDateFieldRootContext } from './context'
import { DATE_FIELD_SEGMENT } from './DateFieldRoot'
import { useSegmentInput } from './segmentInput'

export interface DateFieldInputProps {
  part: DateFieldPart
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const DateFieldInput = defineComponent({
  name: 'DateFieldInput',
  props: {
    part: { type: null as unknown as PropType<DateFieldPart>, required: true },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  setup(props, { slots }) {
    const rootContext = injectDateFieldRootContext()
    const render = useSegmentInput(props, rootContext, {
      segment: () => ({ [DATE_FIELD_SEGMENT]: props.part }),
      snapOnFocusOut: true,
    })
    return () => render(slots)
  },
})
