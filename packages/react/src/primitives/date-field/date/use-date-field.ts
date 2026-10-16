import type {
  CSSProperties,
  CompositionEvent as ReactCompositionEvent,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  RefObject,
} from 'react'
import type { DateValue } from '@internationalized/date'
import type { HourCycle } from '../../../../../shared/src/primitives/date/comparators'
import {
  createDateFieldSegment,
  dateSegmentAttributes,
  SEGMENT_CARET_STYLE,
  type Box,
  type DateFieldPart,
  type SegmentAttributes as DomSegmentAttributes,
} from '../../../../../shared/src/primitives/date/field'
import type { Formatter } from '../../../../../shared/src/primitives/date/formatter'
import type { SegmentValueObj } from '../../../../../shared/src/primitives/date/parser'
import type { DateStep } from '../../../../../shared/src/primitives/date/utils'

export type SegmentAttributes = Record<
  string,
  string | number | boolean | CSSProperties | undefined
>

const REACT_NAMES: Record<string, string> = {
  contenteditable: 'contentEditable',
  tabindex: 'tabIndex',
  spellcheck: 'spellCheck',
  inputmode: 'inputMode',
  autocorrect: 'autoCorrect',
  enterkeyhint: 'enterKeyHint',
}

const caret: CSSProperties = { caretColor: 'transparent' }

function toReactAttributes(attributes: DomSegmentAttributes): SegmentAttributes {
  const result: SegmentAttributes = {}
  for (const [key, value] of Object.entries(attributes))
    result[REACT_NAMES[key] ?? key] =
      key === 'style' && value === SEGMENT_CARET_STYLE ? caret : value
  return result
}

function box(ref: RefObject<boolean>): Box<boolean> {
  return {
    get value() {
      return ref.current
    },
    set value(next) {
      ref.current = next
    },
  }
}

function keyboard(event: ReactKeyboardEvent) {
  return {
    key: event.key,
    isComposing: event.nativeEvent.isComposing,
    target: event.target,
    preventDefault: () => event.preventDefault(),
  } as unknown as KeyboardEvent
}

export interface SegmentStore {
  get: () => SegmentValueObj
  set: (next: SegmentValueObj) => void
}

export interface UseDateFieldProps {
  hasLeftFocus: RefObject<boolean>
  lastKeyZero: RefObject<boolean>
  placeholder: () => DateValue
  hourCycle: HourCycle
  step: Required<DateStep>
  stepSnapping?: boolean
  segmentValues: SegmentStore
  formatter: Formatter
  part: DateFieldPart
  disabled: boolean
  readonly: boolean
  focusNext: () => void
  modelValue: { set: (value: DateValue | undefined) => void }
}

export function useDateField(props: UseDateFieldProps) {
  const segment = createDateFieldSegment({
    hasLeftFocus: box(props.hasLeftFocus),
    lastKeyZero: box(props.lastKeyZero),
    placeholder: props.placeholder,
    hourCycle: props.hourCycle,
    step: () => props.step,
    stepSnapping: () => !!props.stepSnapping,
    formatter: props.formatter,
    segmentValues: props.segmentValues.get,
    assign: fields =>
      props.segmentValues.set({ ...props.segmentValues.get(), ...fields } as SegmentValueObj),
    disabled: () => props.disabled,
    readonly: () => props.readonly,
    part: props.part,
    setModelValue: props.modelValue.set,
    focusNext: props.focusNext,
  })

  const attributes = toReactAttributes(
    dateSegmentAttributes(props.part, {
      disabled: props.disabled,
      placeholder: props.placeholder(),
      hourCycle: props.hourCycle,
      segmentValues: props.segmentValues.get(),
      formatter: props.formatter,
    }),
  )

  return {
    handleSegmentClick: (event: ReactMouseEvent) => segment.handleSegmentClick(event.nativeEvent),
    handleSegmentKeydown: (event: ReactKeyboardEvent) =>
      segment.handleSegmentKeydown(keyboard(event)),
    handleSegmentBeforeInput: segment.handleSegmentBeforeInput,
    handleSegmentCompositionStart: (event: ReactCompositionEvent) =>
      segment.handleSegmentCompositionStart(event.nativeEvent),
    handleSegmentCompositionEnd: (event: ReactCompositionEvent) =>
      segment.handleSegmentCompositionEnd(event.nativeEvent),
    handleSegmentFocusOut: segment.handleSegmentFocusOut,
    attributes,
  }
}
