import { computed, h, mergeProps, ref, renderSlot, withCtx, type Ref, type Slots } from 'vue'
import type { DateValue } from '@internationalized/date'
import type { HourCycle } from '../../../../shared/src/primitives/date/comparators'
import type { DateFieldPart } from '../../../../shared/src/primitives/date/field'
import type { Formatter } from '../../../../shared/src/primitives/date/formatter'
import type { SegmentValueObj } from '../../../../shared/src/primitives/date/parser'
import type { DateStep } from '../../../../shared/src/primitives/date/utils'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useDateFieldSegment } from './useDateFieldSegment'

export interface SegmentInputRoot {
  placeholder: Ref<DateValue>
  hourCycle: HourCycle
  step: Ref<DateStep>
  stepSnapping?: Ref<boolean>
  formatter: Formatter
  segmentValues: Ref<SegmentValueObj>
  disabled: Ref<boolean>
  readonly: Ref<boolean>
  isInvalid: Ref<boolean>
  modelValue: Ref<DateValue | undefined>
  focusNext: () => void
  setFocusedElement: (element: HTMLElement) => void
}

export interface SegmentInputProps {
  part: DateFieldPart
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export interface SegmentInputOptions {
  segment: () => Record<string, unknown>
  extra?: () => Record<string, unknown>
  snapOnFocusOut: boolean
}

export function useSegmentInput(
  props: SegmentInputProps,
  root: SegmentInputRoot,
  options: SegmentInputOptions,
) {
  const hasLeftFocus = ref(true)
  const lastKeyZero = ref(false)
  const segment = useDateFieldSegment({
    hasLeftFocus,
    lastKeyZero,
    placeholder: root.placeholder,
    hourCycle: root.hourCycle,
    step: root.step,
    stepSnapping: root.stepSnapping,
    segmentValues: root.segmentValues,
    formatter: root.formatter,
    part: props.part,
    disabled: root.disabled,
    readonly: root.readonly,
    focusNext: root.focusNext,
    modelValue: root.modelValue,
  })
  const disabled = computed(() => root.disabled.value)
  const readonly = computed(() => root.readonly.value)
  const isInvalid = computed(() => root.isInvalid.value)
  const handlers = {
    onMousedown: segment.handleSegmentClick,
    onKeydown: segment.handleSegmentKeydown,
    onBeforeinput: segment.handleSegmentBeforeInput,
    onCompositionstart: segment.handleSegmentCompositionStart,
    onCompositionend: segment.handleSegmentCompositionEnd,
    onFocusout: () => {
      hasLeftFocus.value = true
      if (options.snapOnFocusOut) segment.handleSegmentFocusOut()
    },
    onFocusin: (event: FocusEvent) => root.setFocusedElement(event.target as HTMLElement),
  }

  return (slots: Slots) =>
    h(
      Primitive,
      mergeProps(
        { as: props.as, 'as-child': props.asChild },
        segment.attributes.value,
        {
          contenteditable: disabled.value || readonly.value ? false : props.part !== 'literal',
          ...options.segment(),
          'aria-disabled': disabled.value ? true : undefined,
          'aria-readonly': readonly.value ? true : undefined,
          'data-disabled': disabled.value ? '' : undefined,
          ...options.extra?.(),
          'data-invalid': isInvalid.value ? '' : undefined,
          'aria-invalid': isInvalid.value ? true : undefined,
        },
        props.part !== 'literal' ? handlers : {},
      ),
      { default: withCtx(() => [renderSlot(slots, 'default')]) },
    )
}
