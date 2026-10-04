'use client'

import { useEffect, useRef, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import { useComposedRefs } from 'radix-ui/internal'
import type { DateValue } from '@internationalized/date'
import { Primitive, type PrimitiveProps } from '../../../lib/primitive'
import type { HourCycle } from './comparators'
import type { Formatter } from './formatter'
import { useDateField, type SegmentStore } from './use-date-field'
import type { DateStep } from './utils'

export interface SegmentInputProps extends PrimitiveProps, HTMLAttributes<HTMLElement> {
  part: string
  children?: ReactNode
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export interface SegmentFieldContext {
  placeholder: () => DateValue
  hourCycle: HourCycle
  step: Required<DateStep>
  stepSnapping?: boolean
  formatter: Formatter
  disabled: boolean
  readonly: boolean
  isInvalid: boolean
  focusNext: () => void
  setFocusedElement: (element: HTMLElement) => void
}

export interface SegmentInputConfig {
  context: SegmentFieldContext
  segmentValues: SegmentStore
  modelValue: { set: (value: DateValue | undefined) => void }
  segmentAttribute: string
  extra?: Record<string, string | undefined>
  snapOnFocusOut: boolean
}

export function SegmentInput({
  config,
  part,
  as = 'div',
  asChild,
  ref,
  ...props
}: SegmentInputProps & { config: SegmentInputConfig }) {
  const { context } = config
  const hasLeftFocus = useRef(true)
  const lastKeyZero = useRef(false)
  const element = useRef<HTMLElement | null>(null)
  const composed = useComposedRefs(ref, element)
  const {
    handleSegmentClick,
    handleSegmentKeydown,
    handleSegmentFocusOut,
    handleSegmentBeforeInput,
    handleSegmentCompositionStart,
    handleSegmentCompositionEnd,
    attributes,
  } = useDateField({
    hasLeftFocus,
    lastKeyZero,
    placeholder: context.placeholder,
    hourCycle: context.hourCycle,
    step: context.step,
    stepSnapping: context.stepSnapping,
    segmentValues: config.segmentValues,
    formatter: context.formatter,
    part: part as never,
    disabled: context.disabled,
    readonly: context.readonly,
    focusNext: context.focusNext,
    modelValue: config.modelValue,
  })
  const beforeInput = useRef(handleSegmentBeforeInput)
  beforeInput.current = handleSegmentBeforeInput
  const editable = part !== 'literal'

  useEffect(() => {
    const node = element.current
    if (!node || !editable) return
    const listener = (event: Event) => beforeInput.current(event as InputEvent)
    node.addEventListener('beforeinput', listener)
    return () => node.removeEventListener('beforeinput', listener)
  }, [editable])

  const handlers = editable
    ? {
        onMouseDown: handleSegmentClick,
        onKeyDown: handleSegmentKeydown,
        onCompositionStart: handleSegmentCompositionStart,
        onCompositionEnd: handleSegmentCompositionEnd,
        onBlur: () => {
          hasLeftFocus.current = true
          if (config.snapOnFocusOut) handleSegmentFocusOut()
        },
        onFocus: (event: { target: EventTarget }) =>
          context.setFocusedElement(event.target as HTMLElement),
      }
    : {}

  return (
    <Primitive
      as={as}
      asChild={asChild}
      {...(attributes as HTMLAttributes<HTMLElement>)}
      contentEditable={context.disabled || context.readonly ? false : editable}
      suppressContentEditableWarning
      {...{ [config.segmentAttribute]: part }}
      aria-disabled={context.disabled ? true : undefined}
      aria-readonly={context.readonly ? true : undefined}
      data-disabled={context.disabled ? '' : undefined}
      {...config.extra}
      data-invalid={context.isInvalid ? '' : undefined}
      aria-invalid={context.isInvalid ? true : undefined}
      {...handlers}
      {...props}
      ref={composed}
    />
  )
}
