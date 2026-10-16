import type { ComputedRef, Ref } from 'vue'
import type { DateValue } from '@internationalized/date'
import type { HourCycle } from '../../../../shared/src/primitives/date/comparators'
import type { Formatter } from '../../../../shared/src/primitives/date/formatter'
import type { SegmentContent, SegmentValueObj } from '../../../../shared/src/primitives/date/parser'
import type { DateStep } from '../../../../shared/src/primitives/date/utils'
import { createContext } from '../utils/createContext'

export interface DateFieldRootContext {
  locale: Ref<string>
  modelValue: Ref<DateValue | undefined>
  placeholder: Ref<DateValue>
  isDateUnavailable?: (date: DateValue) => boolean
  isInvalid: Ref<boolean>
  disabled: Ref<boolean>
  readonly: Ref<boolean>
  formatter: Formatter
  hourCycle: HourCycle
  step: ComputedRef<DateStep>
  stepSnapping: Ref<boolean>
  segmentValues: Ref<SegmentValueObj>
  segmentContents: Ref<SegmentContent[]>
  elements: Ref<Set<HTMLElement>>
  focusNext: () => void
  setFocusedElement: (element: HTMLElement) => void
}

export const [injectDateFieldRootContext, provideDateFieldRootContext] =
  createContext<DateFieldRootContext>('DateFieldRoot')
