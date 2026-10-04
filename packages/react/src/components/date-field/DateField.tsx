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
import type { DateValue } from '@internationalized/date'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { lucide } from '../../lib/icon'
import { Transition } from '../../lib/transition/Transition'
import {
  formatDateValue,
  parseDateValue,
  type DateGranularity,
} from '../../../../shared/src/lib/date'
import { useUiLocale } from '../../locale'
import { DateFieldInput, DateFieldRoot } from '../../primitives/date-field'
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
import { useSegmentFocus } from './hooks/useSegmentFocus'
import { dateFieldControl, dateFieldHost, dateFieldSegment } from './date-field.variants'

const XIcon = lucide(X)

export interface DateFieldHandle {
  clear: () => void
  focus: () => void
}

export interface DateFieldProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'placeholder' | 'defaultValue' | 'children'
> {
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
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
  ref?: Ref<DateFieldHandle>
  [attribute: `data-${string}`]: string | undefined
}

export function DateField({
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
}: DateFieldProps) {
  const t = useUiLocale()
  const group = useInputGroup()
  const host = useRef<HTMLDivElement>(null)
  const [model = null, setModel] = useControllableState<string | null>({
    prop: value,
    defaultProp: defaultValue ?? null,
    onChange: onValueChange as ((value: string | null) => void) | undefined,
    caller: 'DateField',
  })

  const parsed = useMemo(() => parseDateValue(model, granularity), [model, granularity])
  const placeholder = useMemo(
    () => parseDateValue(placeholderProp, granularity),
    [placeholderProp, granularity],
  )
  const minValue = useMemo(() => parseDateValue(min, granularity), [min, granularity])
  const maxValue = useMemo(() => parseDateValue(max, granularity), [max, granularity])
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

  function update(next: DateValue | undefined) {
    setModel(next ? formatDateValue(next, granularity) : null)
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
      data-hn-date-field=""
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
      <DateFieldRoot
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
          segments.map((part, index) => (
            <DateFieldInput
              key={part.part === 'literal' ? `literal-${index}` : part.part}
              part={part.part}
              data-hn-segment=""
              aria-label={part.part === 'literal' ? undefined : segmentLabel(part.part)}
              className={dateFieldSegment({
                part: part.part === 'literal' ? 'literal' : 'editable',
              })}
            >
              {part.value}
            </DateFieldInput>
          ))
        }
      </DateFieldRoot>
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
