'use client'

import {
  Fragment,
  useImperativeHandle,
  useMemo,
  useRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { lucide } from '../../lib/icon'
import { Transition } from '../../lib/transition/Transition'
import {
  formatDateRange,
  parseDateRange,
  parseDateValue,
  type DateGranularity,
  type DateRangeValue,
} from '../../../../shared/src/lib/date'
import { isRangeInvalid } from '../../../../shared/src/lib/date-range-field/validity'
import { useUiLocale } from '../../locale'
import {
  DateRangeFieldInput,
  DateRangeFieldRoot,
  type DateRange,
} from '../../primitives/date-range-field'
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
import { dateRangeFieldSeparator } from './date-range-field.variants'
import { useControllableState } from '../../primitives/utils/controllable-state'

const XIcon = lucide(X)

const sides = ['start', 'end'] as const

export interface DateRangeFieldHandle {
  clear: () => void
  focus: () => void
}

export interface DateRangeFieldProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'placeholder' | 'defaultValue' | 'children'
> {
  value?: DateRangeValue | null
  defaultValue?: DateRangeValue | null
  onValueChange?: (value: DateRangeValue | null) => void
  placeholder?: string
  min?: string
  max?: string
  granularity?: DateGranularity
  hourCycle?: 12 | 24
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
  ref?: Ref<DateRangeFieldHandle>
  [attribute: `data-${string}`]: string | undefined
}

export function DateRangeField({
  value,
  defaultValue,
  onValueChange,
  placeholder: placeholderProp,
  min,
  max,
  granularity = 'day',
  hourCycle,
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
}: DateRangeFieldProps) {
  const t = useUiLocale()
  const group = useInputGroup()
  const host = useRef<HTMLDivElement>(null)
  const [model = null, setModel] = useControllableState<DateRangeValue | null>({
    prop: value,
    defaultProp: defaultValue ?? null,
    onChange: onValueChange as ((value: DateRangeValue | null) => void) | undefined,
    caller: 'DateRangeField',
  })

  const parsed = useMemo(() => parseDateRange(model, granularity), [model, granularity])
  const placeholder = useMemo(
    () => parseDateValue(placeholderProp, granularity),
    [placeholderProp, granularity],
  )
  const minValue = useMemo(() => parseDateValue(min, granularity), [min, granularity])
  const maxValue = useMemo(() => parseDateValue(max, granularity), [max, granularity])
  const outOfRange = isRangeInvalid(parsed, { min: minValue, max: maxValue })

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

  function segmentLabel(side: 'start' | 'end', part: string) {
    const label = (t.dateField as Record<string, string | undefined>)[part]
    return `${t.dateRangeField[side]} ${label}`
  }

  function update(next: DateRange) {
    setModel(formatDateRange(next, granularity))
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
      data-hn-date-range-field=""
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
      <DateRangeFieldRoot
        {...attrs}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        value={parsed}
        placeholder={placeholder}
        minValue={minValue}
        maxValue={maxValue}
        granularity={granularity}
        hourCycle={hourCycle}
        locale={t.tag}
        disabled={disabled}
        readonly={readonly}
        name={name}
        aria-invalid={invalid || undefined}
        className={dateFieldControl({ leading: hasLeading, trailing: clearing || hasTrailing })}
        onValueChange={update}
      >
        {({ segments }) =>
          sides.map((side, index) => (
            <Fragment key={side}>
              {index > 0 && (
                <span aria-hidden="true" className={dateRangeFieldSeparator()}>
                  {t.dateRangeField.separator}
                </span>
              )}
              {segments[side].map((part, position) => (
                <DateRangeFieldInput
                  key={
                    part.part === 'literal' ? `${side}-literal-${position}` : `${side}-${part.part}`
                  }
                  type={side}
                  part={part.part}
                  data-hn-segment=""
                  aria-label={part.part === 'literal' ? undefined : segmentLabel(side, part.part)}
                  className={dateFieldSegment({
                    part: part.part === 'literal' ? 'literal' : 'editable',
                  })}
                >
                  {part.value}
                </DateRangeFieldInput>
              ))}
            </Fragment>
          ))
        }
      </DateRangeFieldRoot>
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
