'use client'

import { useMemo, useRef, type HTMLAttributes, type Ref } from 'react'
import { useComposedRefs, useControllableState } from 'radix-ui/internal'
import { getLocalTimeZone, today, type DateValue } from '@internationalized/date'
import { cn } from '../../lib/cn'
import { formatDateValue, parseDateValue } from '../../../../shared/src/lib/date'
import { formatMonthHeading } from '../../../../shared/src/lib/calendar/format'
import { useUiLocale } from '../../locale'
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarNext,
  CalendarPrev,
  CalendarRoot,
} from '../../primitives/calendar'
import { useWatch } from '../../primitives/date-field/date/hooks'
import { CalendarHeader } from './CalendarHeader'
import { CalendarLevels } from './CalendarLevels'
import { useCalendarLevels } from './hooks/useCalendarLevels'
import {
  calendarCell,
  calendarDay,
  calendarGrid,
  calendarHeadCell,
  calendarRoot,
  type CalendarVariants,
} from './calendar.variants'

export interface CalendarProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'defaultValue' | 'placeholder' | 'children' | 'dir'
> {
  dir?: 'ltr' | 'rtl'
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  placeholder?: string
  defaultPlaceholder?: string
  onPlaceholderChange?: (value: string | undefined) => void
  min?: string
  max?: string
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

export function useUnavailableMatcher(unavailable: ((date: string) => boolean) | undefined) {
  const latest = useRef(unavailable)
  latest.current = unavailable
  const defined = !!unavailable
  return useMemo(
    () => (defined ? (date: DateValue) => latest.current!(formatDateValue(date)) : undefined),
    [defined],
  )
}

export function Calendar({
  value,
  defaultValue,
  onValueChange,
  placeholder: placeholderProp,
  defaultPlaceholder,
  onPlaceholderChange,
  min,
  max,
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
}: CalendarProps) {
  const t = useUiLocale()
  const root = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, root)
  const [model = null, setModel] = useControllableState<string | null>({
    prop: value,
    defaultProp: defaultValue ?? null,
    onChange: onValueChange as ((value: string | null) => void) | undefined,
    caller: 'Calendar',
  })
  const [shown, setShown] = useControllableState<string | undefined>({
    prop: placeholderProp,
    defaultProp: defaultPlaceholder,
    onChange: onPlaceholderChange,
    caller: 'Calendar',
  })

  const parsed = useMemo(() => parseDateValue(model), [model])
  const placeholder = useMemo(() => parseDateValue(shown), [shown])
  const minValue = useMemo(() => parseDateValue(min), [min])
  const maxValue = useMemo(() => parseDateValue(max), [max])
  const weekStartsOn = weekStartsOnProp ?? t.calendar.weekStartsOn
  const unavailable = useUnavailableMatcher(unavailableProp)

  const { level, setLevel, view, setView, pickMonth, pickYear, followYear, back, onEntered } =
    useCalendarLevels(parsed ?? placeholder ?? today(getLocalTimeZone()), root, next =>
      setShown(formatDateValue(next)),
    )

  useWatch([placeholder] as const, ([next]) => {
    if (next && next.compare(view) !== 0) setView(next)
  })

  const monthHeading = formatMonthHeading(t.tag, view)

  function update(next: DateValue | DateValue[] | undefined) {
    const picked = Array.isArray(next) ? next[0] : next
    setModel(picked ? formatDateValue(picked) : null)
  }

  return (
    <CalendarRoot
      ref={composedRef}
      data-hn-calendar=""
      data-level={level}
      value={parsed}
      placeholder={view}
      minValue={minValue}
      maxValue={maxValue}
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
            prev={CalendarPrev}
            next={CalendarNext}
            prevLabel={t.calendar.prev}
            nextLabel={t.calendar.next}
            heading={monthHeading}
            pickLabel={t.calendar.pickMonth}
            size={size}
            disabled={disabled}
            onPick={() => setLevel('month')}
          />
          {grid.map(month => (
            <CalendarGrid key={month.value.toString()} className={calendarGrid()}>
              <CalendarGridHead>
                <CalendarGridRow>
                  {weekDays.map(day => (
                    <CalendarHeadCell key={day} className={calendarHeadCell({ size })}>
                      {day}
                    </CalendarHeadCell>
                  ))}
                </CalendarGridRow>
              </CalendarGridHead>
              <CalendarGridBody>
                {month.rows.map((week, index) => (
                  <CalendarGridRow key={index}>
                    {week.map(day => (
                      <CalendarCell key={day.toString()} date={day} className={calendarCell()}>
                        <CalendarCellTrigger
                          day={day}
                          month={month.value}
                          className={calendarDay()}
                        />
                      </CalendarCell>
                    ))}
                  </CalendarGridRow>
                ))}
              </CalendarGridBody>
            </CalendarGrid>
          ))}
        </CalendarLevels>
      )}
    </CalendarRoot>
  )
}
