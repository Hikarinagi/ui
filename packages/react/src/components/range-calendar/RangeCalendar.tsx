'use client'

import { useMemo, useRef, type HTMLAttributes, type Ref } from 'react'
import { getLocalTimeZone, today, type DateValue } from '@internationalized/date'
import { cn } from '../../lib/cn'
import {
  formatDateRange,
  formatDateValue,
  parseDateRange,
  parseDateValue,
  type DateRangeValue,
} from '../../../../shared/src/lib/date'
import { formatMonthHeading } from '../../../../shared/src/lib/calendar/format'
import { maximumDaysMatcher } from '../../../../shared/src/lib/range-calendar/limit'
import { useUiLocale } from '../../locale'
import {
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
  RangeCalendarNext,
  RangeCalendarPrev,
  RangeCalendarRoot,
  type DateRange,
} from '../../primitives/range-calendar'
import { useWatch } from '../../primitives/date-field/date/hooks'
import { CalendarHeader } from '../calendar/CalendarHeader'
import { CalendarLevels } from '../calendar/CalendarLevels'
import { useUnavailableMatcher } from '../calendar/Calendar'
import { useCalendarLevels } from '../calendar/hooks/useCalendarLevels'
import {
  calendarGrid,
  calendarHeadCell,
  calendarRoot,
  type CalendarVariants,
} from '../calendar/calendar.variants'
import { useRangeAnchor } from './hooks/useRangeAnchor'
import { rangeCalendarCell, rangeCalendarDay } from './range-calendar.variants'
import { useComposedRefs } from '../../primitives/utils/compose-refs'
import { useControllableState } from '../../primitives/utils/controllable-state'

export interface RangeCalendarProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'defaultValue' | 'placeholder' | 'children' | 'dir'
> {
  dir?: 'ltr' | 'rtl'
  value?: DateRangeValue | null
  defaultValue?: DateRangeValue | null
  onValueChange?: (value: DateRangeValue | null) => void
  placeholder?: string
  defaultPlaceholder?: string
  onPlaceholderChange?: (value: string | undefined) => void
  min?: string
  max?: string
  maximumDays?: number
  unavailable?: (date: string) => boolean
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  weekdayFormat?: 'narrow' | 'short'
  fixedWeeks?: boolean
  size?: CalendarVariants['size']
  autofocus?: boolean
  readonly?: boolean
  disabled?: boolean
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function RangeCalendar({
  value,
  defaultValue,
  onValueChange,
  placeholder: placeholderProp,
  defaultPlaceholder,
  onPlaceholderChange,
  min,
  max,
  maximumDays,
  unavailable: unavailableProp,
  weekStartsOn: weekStartsOnProp,
  weekdayFormat = 'narrow',
  fixedWeeks = true,
  size = 'md',
  autofocus,
  readonly,
  disabled,
  className,
  ref,
  ...attrs
}: RangeCalendarProps) {
  const t = useUiLocale()
  const root = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, root)
  const [model = null, setModel] = useControllableState<DateRangeValue | null>({
    prop: value,
    defaultProp: defaultValue ?? null,
    onChange: onValueChange as ((value: DateRangeValue | null) => void) | undefined,
    caller: 'RangeCalendar',
  })
  const [shown, setShown] = useControllableState<string | undefined>({
    prop: placeholderProp,
    defaultProp: defaultPlaceholder,
    onChange: onPlaceholderChange,
    caller: 'RangeCalendar',
  })

  const parsed = useMemo(() => parseDateRange(model), [model])
  const placeholder = useMemo(() => parseDateValue(shown), [shown])
  const minValue = useMemo(() => parseDateValue(min), [min])
  const maxValue = useMemo(() => parseDateValue(max), [max])
  const weekStartsOn = weekStartsOnProp ?? t.calendar.weekStartsOn
  const unavailable = useUnavailableMatcher(unavailableProp)
  const { anchor, onStartValue } = useRangeAnchor(parsed.start)
  const limited = maximumDaysMatcher(anchor, parsed.end, maximumDays)
  const limitedRef = useRef(limited)
  limitedRef.current = limited
  const isDateDisabled = useMemo(
    () => (date: DateValue) => (limitedRef.current ? limitedRef.current(date) : false),
    [],
  )

  const { level, setLevel, view, setView, pickMonth, pickYear, followYear, back, onEntered } =
    useCalendarLevels(parsed.start ?? placeholder ?? today(getLocalTimeZone()), root, next =>
      setShown(formatDateValue(next)),
    )

  useWatch([placeholder] as const, ([next]) => {
    if (next && next.compare(view) !== 0) setView(next)
  })

  const monthHeading = formatMonthHeading(t.tag, view)

  function update(next: DateRange) {
    setModel(formatDateRange(next))
  }

  return (
    <RangeCalendarRoot
      ref={composedRef}
      data-hn-range-calendar=""
      data-level={level}
      value={parsed}
      placeholder={view}
      minValue={minValue}
      maxValue={maxValue}
      isDateDisabled={isDateDisabled}
      isDateUnavailable={unavailable}
      weekStartsOn={weekStartsOn}
      weekdayFormat={weekdayFormat}
      fixedWeeks={fixedWeeks}
      initialFocus={autofocus}
      locale={t.tag}
      calendarLabel={t.calendar.label}
      disabled={disabled}
      readonly={readonly}
      {...attrs}
      className={cn(calendarRoot({ size }), className)}
      onValueChange={update}
      onStartValueChange={onStartValue}
      onPlaceholderChange={setView}
    >
      {({ weekDays, grid }) => (
        <CalendarLevels
          level={level}
          onLevelChange={setLevel}
          view={view}
          size={size}
          minValue={minValue}
          maxValue={maxValue}
          disabled={disabled}
          onPickMonth={pickMonth}
          onPickYear={pickYear}
          onFollowYear={followYear}
          onBack={back}
          onEntered={onEntered}
        >
          <CalendarHeader
            prev={RangeCalendarPrev}
            next={RangeCalendarNext}
            prevLabel={t.calendar.prev}
            nextLabel={t.calendar.next}
            heading={monthHeading}
            pickLabel={t.calendar.pickMonth}
            size={size}
            disabled={disabled}
            onPick={() => setLevel('month')}
          />
          {grid.map(month => (
            <RangeCalendarGrid key={month.value.toString()} className={calendarGrid()}>
              <RangeCalendarGridHead>
                <RangeCalendarGridRow>
                  {weekDays.map(day => (
                    <RangeCalendarHeadCell key={day} className={calendarHeadCell({ size })}>
                      {day}
                    </RangeCalendarHeadCell>
                  ))}
                </RangeCalendarGridRow>
              </RangeCalendarGridHead>
              <RangeCalendarGridBody>
                {month.rows.map((week, index) => (
                  <RangeCalendarGridRow key={index}>
                    {week.map(day => (
                      <RangeCalendarCell
                        key={day.toString()}
                        date={day}
                        className={rangeCalendarCell()}
                      >
                        <RangeCalendarCellTrigger
                          day={day}
                          month={month.value}
                          className={rangeCalendarDay()}
                        />
                      </RangeCalendarCell>
                    ))}
                  </RangeCalendarGridRow>
                ))}
              </RangeCalendarGridBody>
            </RangeCalendarGrid>
          ))}
        </CalendarLevels>
      )}
    </RangeCalendarRoot>
  )
}
