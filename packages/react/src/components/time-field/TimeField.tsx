'use client'

import {
  useImperativeHandle,
  useMemo,
  useRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react'
import { X } from 'lucide-react'
import { useControllableState } from 'radix-ui/internal'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { lucide } from '../../lib/icon'
import { Transition } from '../../lib/transition/Transition'
import {
  formatTimeValue,
  parseTimeValue,
  type TimeGranularity,
} from '../../../../shared/src/lib/date'
import { useUiLocale } from '../../locale'
import { TimeFieldInput, TimeFieldRoot, type TimeValue } from '../../primitives/time-field'
import { useFieldControl } from '../form-field/context'
import { useInputGroup } from '../input-group/context'
import { InputAction } from '../input/InputAction'
import {
  inputActionSlot,
  inputAdornment,
  inputEmbedded,
  inputHost,
  type InputVariants,
} from '../input/input.variants'
import { useSegmentFocus } from '../date-field/hooks/useSegmentFocus'
import {
  dateFieldControl,
  dateFieldHost,
  dateFieldSegment,
} from '../date-field/date-field.variants'

const XIcon = lucide(X)

export interface TimeFieldHandle {
  clear: () => void
  focus: () => void
}

export interface TimeFieldProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'placeholder' | 'defaultValue' | 'children'
> {
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  placeholder?: string
  min?: string
  max?: string
  granularity?: TimeGranularity
  hourCycle?: 12 | 24
  minuteStep?: number
  clearable?: boolean
  readonly?: boolean
  name?: string
  variant?: InputVariants['variant']
  size?: InputVariants['size']
  disabled?: boolean
  invalid?: boolean
  onClear?: () => void
  leading?: ReactNode
  trailing?: ReactNode
  ref?: Ref<TimeFieldHandle>
  [attribute: `data-${string}`]: string | undefined
}

export function TimeField({
  value,
  defaultValue,
  onValueChange,
  placeholder: placeholderProp,
  min,
  max,
  granularity = 'minute',
  hourCycle,
  minuteStep,
  clearable = false,
  readonly,
  name,
  variant,
  size,
  disabled: disabledProp,
  invalid: invalidProp,
  onClear,
  leading,
  trailing,
  className,
  ref,
  ...attrs
}: TimeFieldProps) {
  const t = useUiLocale()
  const group = useInputGroup()
  const host = useRef<HTMLDivElement>(null)
  const [model = null, setModel] = useControllableState<string | null>({
    prop: value,
    defaultProp: defaultValue ?? null,
    onChange: onValueChange as ((value: string | null) => void) | undefined,
    caller: 'TimeField',
  })

  const parsed = useMemo(() => parseTimeValue(model), [model])
  const placeholder = useMemo(() => parseTimeValue(placeholderProp), [placeholderProp])
  const minValue = useMemo(() => parseTimeValue(min), [min])
  const maxValue = useMemo(() => parseTimeValue(max), [max])
  const step = useMemo(() => (minuteStep ? { minute: minuteStep } : undefined), [minuteStep])
  const outOfRange =
    !!parsed &&
    ((!!minValue && parsed.compare(minValue) < 0) || (!!maxValue && parsed.compare(maxValue) > 0))

  const { labelledBy, invalid, disabled, describedBy } = useFieldControl(
    {
      invalid: invalidProp || !!group?.invalid || outOfRange,
      disabled: disabledProp || !!group?.disabled,
    },
    attrs,
  )
  const clearing = clearable && model != null && !disabled
  const hasLeading = hasContent(leading)
  const hasTrailing = hasContent(trailing)

  function segmentLabel(part: string) {
    return (t.dateField as Record<string, string | undefined>)[part]
  }

  function update(next: TimeValue | undefined) {
    setModel(next ? formatTimeValue(next, granularity) : null)
  }

  const { focus, onHostClick } = useSegmentFocus(host)

  function clear() {
    if (model == null) return
    setModel(null)
    onClear?.()
    focus()
  }

  useImperativeHandle(ref, () => ({ clear, focus }))

  return (
    <div
      ref={host}
      data-hn-time-field=""
      data-invalid={invalid ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      className={cn(
        group ? inputEmbedded() : inputHost({ variant, size }),
        dateFieldHost(),
        className,
      )}
      onClick={onHostClick}
    >
      {hasLeading && <span className={inputAdornment()}>{leading}</span>}
      <TimeFieldRoot
        {...attrs}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        value={parsed}
        placeholder={placeholder}
        minValue={minValue}
        maxValue={maxValue}
        granularity={granularity}
        hourCycle={hourCycle}
        step={step}
        stepSnapping={!!step}
        hideTimeZone
        locale={t.tag}
        disabled={disabled}
        readonly={readonly}
        name={name}
        aria-invalid={invalid || undefined}
        className={dateFieldControl({ leading: hasLeading, trailing: clearing || hasTrailing })}
        onValueChange={update}
      >
        {({ segments }) =>
          segments.map((part, index) => (
            <TimeFieldInput
              key={part.part === 'literal' ? `literal-${index}` : part.part}
              part={part.part}
              data-hn-segment=""
              aria-label={part.part === 'literal' ? undefined : segmentLabel(part.part)}
              className={dateFieldSegment({
                part: part.part === 'literal' ? 'literal' : 'editable',
              })}
            >
              {part.value}
            </TimeFieldInput>
          ))
        }
      </TimeFieldRoot>
      <Transition
        show={clearing}
        enterActiveClass="hn-transition-base"
        enterFromClass="scale-90 opacity-0"
        leaveActiveClass="hn-transition"
        leaveToClass="scale-90 opacity-0"
      >
        <span className={inputActionSlot()}>
          <InputAction label={t.common.clear} onClick={clear}>
            <XIcon />
          </InputAction>
        </span>
      </Transition>
      {hasTrailing && <span className={inputAdornment()}>{trailing}</span>}
    </div>
  )
}
