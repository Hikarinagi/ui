'use client'

import type { HTMLAttributes, ReactNode } from 'react'
import { CalendarClock } from 'lucide-react'
import { cn } from '../../lib/cn'
import { lucide } from '../../lib/icon'
import { joinDateTime, splitDateTime, type TimeGranularity } from '../../../../shared/src/lib/date'
import { useUiLocale } from '../../locale'
import {
  PopoverAnchor,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from '../../primitives/popover'
import { Button } from '../button/Button'
import { Calendar } from '../calendar/Calendar'
import type { CalendarVariants } from '../calendar/calendar.variants'
import { Card } from '../card/Card'
import { DateField } from '../date-field/DateField'
import { datePickerContent } from '../date-picker/date-picker.variants'
import { useFieldControl } from '../form-field/context'
import { useInputGroup } from '../input-group/context'
import { InputGroupScope } from '../input-group/InputGroupScope'
import { InputAction } from '../input/InputAction'
import { inputEmbedded, inputHost, type InputVariants } from '../input/input.variants'
import { TimeField } from '../time-field/TimeField'
import { dateTimePickerFooter } from './date-time-picker.variants'
import { useControllableState } from '../../primitives/utils/controllable-state'

const CalendarClockIcon = lucide(CalendarClock)

export interface DateTimePickerProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'placeholder' | 'defaultValue' | 'children'
> {
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  placeholder?: string
  min?: string
  max?: string
  granularity?: Exclude<TimeGranularity, 'hour'>
  hourCycle?: 12 | 24
  minuteStep?: number
  unavailable?: (date: string) => boolean
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  weekdayFormat?: 'narrow' | 'short'
  fixedWeeks?: boolean
  clearable?: boolean
  readonly?: boolean
  name?: string
  variant?: InputVariants['variant']
  size?: InputVariants['size']
  disabled?: boolean
  invalid?: boolean
  onClear?: () => void
  leading?: ReactNode
  [attribute: `data-${string}`]: string | undefined
}

export function DateTimePicker({
  value,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen,
  onOpenChange,
  placeholder,
  min,
  max,
  granularity = 'minute',
  hourCycle,
  minuteStep,
  unavailable,
  weekStartsOn,
  weekdayFormat,
  fixedWeeks = true,
  clearable = false,
  readonly,
  name,
  variant,
  size: sizeProp,
  disabled: disabledProp,
  invalid: invalidProp,
  onClear,
  leading,
  className,
  ...attrs
}: DateTimePickerProps) {
  const t = useUiLocale()
  const outer = useInputGroup()
  const [model = null, setModel] = useControllableState<string | null>({
    prop: value,
    defaultProp: defaultValue ?? null,
    onChange: onValueChange as ((value: string | null) => void) | undefined,
    caller: 'DateTimePicker',
  })
  const [open = false, setOpen] = useControllableState<boolean>({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: 'DateTimePicker',
  })

  const size = outer ? outer.size : sizeProp
  const { invalid, disabled } = useFieldControl(
    {
      invalid: invalidProp || !!outer?.invalid,
      disabled: disabledProp || !!outer?.disabled,
    },
    attrs,
  )
  const calendarSize: CalendarVariants['size'] = size ?? 'md'

  const parts = splitDateTime(model)
  const fallbackTime =
    splitDateTime(placeholder).time ?? (granularity === 'second' ? '00:00:00' : '00:00')
  const minDate = splitDateTime(min).date ?? undefined
  const maxDate = splitDateTime(max).date ?? undefined

  function pickDate(date: string | null) {
    setModel(joinDateTime(date, parts.time ?? fallbackTime))
  }

  function pickTime(time: string | null) {
    setModel(joinDateTime(parts.date, time))
  }

  function done() {
    setOpen(false)
  }

  return (
    <PopoverRoot open={open} onOpenChange={setOpen} modal>
      <PopoverAnchor asChild>
        <div
          data-hn-date-time-picker=""
          data-invalid={invalid ? '' : undefined}
          data-disabled={disabled ? '' : undefined}
          className={cn(
            outer ? inputEmbedded() : inputHost({ variant, size: sizeProp }),
            className,
          )}
        >
          <InputGroupScope size={size} disabled={disabled} invalid={invalid}>
            <DateField
              {...attrs}
              value={model}
              placeholder={placeholder}
              min={min}
              max={max}
              granularity={granularity}
              hourCycle={hourCycle}
              clearable={clearable}
              readonly={readonly}
              name={name}
              onValueChange={setModel}
              onClear={onClear}
              leading={leading}
            />
          </InputGroupScope>
          <PopoverTrigger asChild>
            <InputAction label={t.datePicker.open} disabled={disabled}>
              <CalendarClockIcon />
            </InputAction>
          </PopoverTrigger>
        </div>
      </PopoverAnchor>
      <PopoverPortal>
        <PopoverContent
          asChild
          side="bottom"
          align="start"
          sideOffset={8}
          onOpenAutoFocus={event => event.preventDefault()}
        >
          <Card padded={false} className={datePickerContent()}>
            <Calendar
              value={parts.date}
              placeholder={splitDateTime(placeholder).date ?? undefined}
              min={minDate}
              max={maxDate}
              unavailable={unavailable}
              weekStartsOn={weekStartsOn}
              weekdayFormat={weekdayFormat}
              fixedWeeks={fixedWeeks}
              size={calendarSize}
              readonly={readonly}
              autofocus
              onValueChange={pickDate}
            />
            <div className={dateTimePickerFooter()}>
              <TimeField
                value={parts.time}
                placeholder={fallbackTime}
                granularity={granularity}
                hourCycle={hourCycle}
                minuteStep={minuteStep}
                size={calendarSize}
                readonly={readonly}
                aria-label={t.dateTimePicker.time}
                onValueChange={pickTime}
              />
              <Button size={calendarSize} onClick={done}>
                {t.common.confirm}
              </Button>
            </div>
          </Card>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  )
}
