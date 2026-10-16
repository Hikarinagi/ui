import { computed, type Ref } from 'vue'
import type { DateValue } from '@internationalized/date'
import type { HourCycle } from '../../../../shared/src/primitives/date/comparators'
import {
  createDateFieldSegment,
  dateSegmentAttributes,
  type DateFieldPart,
} from '../../../../shared/src/primitives/date/field'
import type { Formatter } from '../../../../shared/src/primitives/date/formatter'
import type { SegmentValueObj } from '../../../../shared/src/primitives/date/parser'
import type { DateStep } from '../../../../shared/src/primitives/date/utils'

export interface DateFieldSegmentProps {
  hasLeftFocus: Ref<boolean>
  lastKeyZero: Ref<boolean>
  placeholder: Ref<DateValue>
  hourCycle: HourCycle
  step: Ref<DateStep>
  stepSnapping?: Ref<boolean>
  formatter: Formatter
  segmentValues: Ref<SegmentValueObj>
  disabled: Ref<boolean>
  readonly: Ref<boolean>
  part: DateFieldPart
  modelValue: Ref<DateValue | undefined>
  focusNext: () => void
}

export function useDateFieldSegment(props: DateFieldSegmentProps) {
  const segment = createDateFieldSegment({
    hasLeftFocus: props.hasLeftFocus,
    lastKeyZero: props.lastKeyZero,
    placeholder: () => props.placeholder.value,
    hourCycle: props.hourCycle,
    step: () => props.step.value,
    stepSnapping: () => !!props.stepSnapping?.value,
    formatter: props.formatter,
    segmentValues: () => props.segmentValues.value,
    assign: fields => {
      const values = props.segmentValues.value as Record<string, unknown>
      for (const [part, value] of Object.entries(fields)) values[part] = value
    },
    disabled: () => props.disabled.value,
    readonly: () => props.readonly.value,
    part: props.part,
    setModelValue: value => {
      props.modelValue.value = value
    },
    focusNext: props.focusNext,
  })

  const attributes = computed(() =>
    dateSegmentAttributes(props.part, {
      disabled: props.disabled.value,
      placeholder: props.placeholder.value,
      hourCycle: props.hourCycle,
      segmentValues: props.segmentValues.value,
      formatter: props.formatter,
    }),
  )

  return { ...segment, attributes }
}
