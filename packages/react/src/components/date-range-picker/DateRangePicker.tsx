'use client'

import type { HTMLAttributes, ReactNode } from 'react'
import { CalendarRange } from 'lucide-react'
import { useControllableState } from 'radix-ui/internal'
import { cn } from '../../lib/cn'
import type { DateRangeValue } from '../../../../shared/src/lib/date'
import { lucide } from '../../lib/icon'
import { useUiLocale } from '../../locale'
import {
  PopoverAnchor,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from '../../primitives/popover'
import type { CalendarVariants } from '../calendar/calendar.variants'
import { Card } from '../card/Card'
import { DateRangeField } from '../date-range-field/DateRangeField'
import { datePickerContent } from '../date-picker/date-picker.variants'
import { useFieldControl } from '../form-field/context'
import { useInputGroup } from '../input-group/context'
import { InputGroupScope } from '../input-group/InputGroupScope'
import { InputAction } from '../input/InputAction'
import { inputEmbedded, inputHost, type InputVariants } from '../input/input.variants'
import { RangeCalendar } from '../range-calendar/RangeCalendar'

const CalendarRangeIcon = lucide(CalendarRange)

export interface DateRangePickerProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'placeholder' | 'defaultValue' | 'children'
> {
  value?: DateRangeValue | null
  defaultValue?: DateRangeValue | null
  onValueChange?: (value: DateRangeValue | null) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  placeholder?: string
  min?: string
  max?: string
  maximumDays?: number
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

export function DateRangePicker({
  value,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen,
  onOpenChange,
  placeholder,
  min,
  max,
  maximumDays,
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
}: DateRangePickerProps) {
  const t = useUiLocale()
  const outer = useInputGroup()
  const [model = null, setModel] = useControllableState<DateRangeValue | null>({
    prop: value,
    defaultProp: defaultValue ?? null,
    onChange: onValueChange as ((value: DateRangeValue | null) => void) | undefined,
    caller: 'DateRangePicker',
  })
  const [open = false, setOpen] = useControllableState<boolean>({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: 'DateRangePicker',
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

  function pick(next: DateRangeValue | null) {
    setModel(next)
    if (next?.start && next.end) setOpen(false)
  }

  return (
    <PopoverRoot open={open} onOpenChange={setOpen} modal>
      <PopoverAnchor asChild>
        <div
          data-hn-date-range-picker=""
          data-invalid={invalid ? '' : undefined}
          data-disabled={disabled ? '' : undefined}
          className={cn(
            outer ? inputEmbedded() : inputHost({ variant, size: sizeProp }),
            className,
          )}
        >
          <InputGroupScope size={size} disabled={disabled} invalid={invalid}>
            <DateRangeField
              {...attrs}
              value={model}
              placeholder={placeholder}
              min={min}
              max={max}
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
              <CalendarRangeIcon />
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
            <RangeCalendar
              value={model}
              placeholder={placeholder}
              min={min}
              max={max}
              maximumDays={maximumDays}
              unavailable={unavailable}
              weekStartsOn={weekStartsOn}
              weekdayFormat={weekdayFormat}
              fixedWeeks={fixedWeeks}
              size={calendarSize}
              readonly={readonly}
              autofocus
              onValueChange={pick}
            />
          </Card>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  )
}
