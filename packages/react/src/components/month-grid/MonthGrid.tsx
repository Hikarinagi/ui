'use client'

import { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useControllableState } from 'radix-ui/internal'
import { CalendarDays } from 'lucide-react'
import { today as currentDate, type DateValue } from '@internationalized/date'
import { monthGridDates, parseMonth, shiftMonth } from '../../../../shared/src/lib/month-grid'
import { formatDateValue, parseDateValue } from '../../../../shared/src/lib/date'
import { cn } from '../../lib/cn'
import { lucide } from '../../lib/icon'
import { useDirection } from '../../lib/useDirection'
import { useUiLocale } from '../../locale'
import { useWatch } from '../../primitives/date-field/date/hooks'
import { Button } from '../button/Button'
import { IconButton } from '../icon-button/IconButton'
import { Popover } from '../popover/Popover'
import { CalendarHeader } from '../calendar/CalendarHeader'
import { CalendarLevels } from '../calendar/CalendarLevels'
import { calendarHeading, calendarRoot } from '../calendar/calendar.variants'
import type { CalendarLevel } from '../calendar/hooks/useCalendarLevels'
import {
  monthGrid,
  monthGridActions,
  monthGridCell,
  monthGridDate,
  monthGridDay,
  monthGridDayHeader,
  monthGridHeader,
  monthGridTable,
  monthGridWeekday,
} from './month-grid.variants'
import type {
  MonthGridDay,
  MonthGridHeader,
  MonthGridProps,
  MonthGridRange,
  MonthGridWeekday,
} from './types'

const CalendarDaysIcon = lucide(CalendarDays)

function length(value: number | string | undefined) {
  return typeof value === 'number' ? `${Math.max(0, value)}px` : value
}

function dayClassOf(value: MonthGridProps['cellClass'], day: MonthGridDay) {
  return typeof value === 'function' ? value(day) : value
}

export function MonthGrid({
  month: monthProp,
  defaultMonth,
  onMonthChange,
  onRangeChange,
  dir,
  min,
  max,
  today: todayProp,
  timeZone = 'UTC',
  weekStartsOn: weekStartsOnProp,
  weekdayFormat = 'short',
  fixedWeeks = true,
  showOutsideDays = true,
  showToday = true,
  showHeader = true,
  disabled,
  size = 'md',
  dayMinHeight,
  dayPadding,
  cellClass,
  dayClass,
  label: labelProp,
  className,
  style,
  children,
  renderDay,
  renderDate,
  renderDayTrailing,
  renderHeader,
  renderHeaderActions,
  renderWeekday,
  renderFooter,
  ref,
  ...attrs
}: MonthGridProps) {
  const t = useUiLocale()
  const { root, direction, rootDirection } = useDirection<HTMLDivElement>(dir)
  const [model, setModel] = useControllableState<string | undefined>({
    prop: monthProp,
    defaultProp: defaultMonth,
    onChange: onMonthChange,
    caller: 'MonthGrid',
  })
  const layout: Record<string, string | undefined> = {}
  if (length(dayMinHeight) !== undefined) layout['--hn-month-grid-cell'] = length(dayMinHeight)
  if (length(dayPadding) !== undefined) layout['--hn-month-grid-padding'] = length(dayPadding)

  const today = formatDateValue(parseDateValue(todayProp) ?? currentDate(timeZone))
  const minDate = useMemo(() => parseDateValue(min), [min])
  const maxDate = useMemo(() => parseDateValue(max), [max])
  const limits: { min?: DateValue; max?: DateValue } = useMemo(
    () =>
      minDate && maxDate && minDate.compare(maxDate) > 0 ? {} : { min: minDate, max: maxDate },
    [minDate, maxDate],
  )
  let month = parseMonth(model) ? model! : today.slice(0, 7)
  const minMonth = limits.min?.toString().slice(0, 7)
  const maxMonth = limits.max?.toString().slice(0, 7)
  if (minMonth && month < minMonth) month = minMonth
  if (maxMonth && month > maxMonth) month = maxMonth
  const weekStartsOn = weekStartsOnProp ?? t.calendar.weekStartsOn
  const dates = useMemo(
    () => monthGridDates(month, weekStartsOn, fixedWeeks),
    [month, weekStartsOn, fixedWeeks],
  )
  const range = useMemo<MonthGridRange>(
    () => ({ month, start: dates[0]![0]!, end: dates.at(-1)!.at(-1)! }),
    [month, dates],
  )
  const dateFormatter = new Intl.DateTimeFormat(t.tag, {
    dateStyle: 'full',
    timeZone: 'UTC',
    calendar: 'gregory',
  })
  const numberFormatter = new Intl.NumberFormat(t.tag, { useGrouping: false })
  const label = new Intl.DateTimeFormat(t.tag, {
    year: 'numeric',
    month: 'long',
    timeZone: 'UTC',
    calendar: 'gregory',
  }).format(new Date(`${month}-01T00:00:00Z`))
  const weeks: MonthGridDay[][] = dates.map(week =>
    week.map(date => ({
      date,
      day: Number(date.slice(-2)),
      dayLabel: numberFormatter.format(Number(date.slice(-2))),
      weekday: new Date(`${date}T00:00:00Z`).getUTCDay() as MonthGridDay['weekday'],
      label: dateFormatter.format(new Date(`${date}T00:00:00Z`)),
      isToday: date === today,
      isPast: date < today,
      isFuture: date > today,
      isOutside: date.slice(0, 7) !== month,
      isDisabled:
        !!disabled ||
        !/^\d{4}-/.test(date) ||
        date.startsWith('0000') ||
        !!(limits.min && date < limits.min.toString()) ||
        !!(limits.max && date > limits.max.toString()),
    })),
  )
  const short = new Intl.DateTimeFormat(t.tag, { weekday: weekdayFormat, timeZone: 'UTC' })
  const full = new Intl.DateTimeFormat(t.tag, { weekday: 'long', timeZone: 'UTC' })
  const weekdays: MonthGridWeekday[] = dates[0]!.map(date => {
    const value = new Date(`${date}T00:00:00Z`)
    return { day: value.getUTCDay(), label: short.format(value), fullLabel: full.format(value) }
  })

  function allowed(value: string) {
    return (
      !disabled &&
      value !== month &&
      (!limits.min || value >= limits.min.toString().slice(0, 7)) &&
      (!limits.max || value <= limits.max.toString().slice(0, 7))
    )
  }

  function navigate(value: string) {
    if (parseMonth(value) && allowed(value)) setModel(value)
  }

  const header: MonthGridHeader = {
    ...range,
    label,
    canPrev: allowed(shiftMonth(month, -1)),
    canNext: allowed(shiftMonth(month, 1)),
    canToday: allowed(today.slice(0, 7)),
    prev: () => navigate(shiftMonth(month, -1)),
    next: () => navigate(shiftMonth(month, 1)),
    goToToday: () => navigate(today.slice(0, 7)),
  }

  const [pickerOpen, setPickerOpen] = useState(false)
  const [level, setLevel] = useState<CalendarLevel>('month')
  const [pickerView, setPickerView] = useState<DateValue>(() => parseDateValue(`${month}-01`)!)
  const pickerViewRef = useRef(pickerView)
  pickerViewRef.current = pickerView
  const levelRef = useRef(level)
  levelRef.current = level

  useWatch([pickerOpen] as const, ([open]) => {
    if (open) {
      setPickerView(parseDateValue(`${month}-01`)!)
      setLevel('month')
    }
  })

  useWatch([disabled, showHeader] as const, ([isDisabled, isShown]) => {
    if (isDisabled || !isShown) setPickerOpen(false)
  })

  function pickMonth(value: DateValue | DateValue[] | undefined) {
    const date = Array.isArray(value) ? value[0] : value
    if (date) {
      navigate(formatDateValue(date).slice(0, 7))
      setPickerOpen(false)
    }
  }

  function pickYear(value: DateValue | DateValue[] | undefined) {
    const date = Array.isArray(value) ? value[0] : value
    if (date) {
      setPickerView(pickerViewRef.current.set({ year: date.year }))
      setLevel('month')
    }
  }

  function back() {
    if (levelRef.current === 'year') setLevel('month')
    else setPickerOpen(false)
  }

  const rangeChange = useRef(onRangeChange)
  rangeChange.current = onRangeChange
  useEffect(() => {
    rangeChange.current?.(range)
  }, [])
  useWatch([range] as const, ([value]) => {
    rangeChange.current?.(value)
  })

  const headerRef = useRef(header)
  headerRef.current = header
  const rangeRef = useRef(range)
  rangeRef.current = range
  useImperativeHandle(ref, () => ({
    get range() {
      return rangeRef.current
    },
    prev: () => headerRef.current.prev(),
    next: () => headerRef.current.next(),
    goToToday: () => headerRef.current.goToToday(),
  }))

  return (
    <div
      ref={root}
      data-hn-month-grid=""
      dir={rootDirection}
      {...attrs}
      className={cn(monthGrid({ size }), className)}
      style={{ ...layout, ...style }}
    >
      {showHeader && (
        <div data-hn-month-grid-header="" className={monthGridHeader()}>
          {renderHeader ? (
            renderHeader(header)
          ) : (
            <>
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <CalendarHeader
                  className="min-w-0 flex-1"
                  prevLabel={t.calendar.prev}
                  nextLabel={t.calendar.next}
                  heading={label}
                  prevDisabled={!header.canPrev}
                  nextDisabled={!header.canNext}
                  disabled={disabled}
                  size={size}
                  onPrev={header.prev}
                  onNext={header.next}
                  headingContent={
                    <Popover
                      open={pickerOpen}
                      onOpenChange={setPickerOpen}
                      aria-label={t.calendar.pickMonth}
                      content={
                        <div dir={direction} className={calendarRoot({ size })}>
                          <CalendarLevels
                            level={level}
                            onLevelChange={setLevel}
                            view={pickerView}
                            dir={direction}
                            size={size}
                            minValue={limits.min}
                            maxValue={limits.max}
                            disabled={disabled}
                            onPickMonth={pickMonth}
                            onPickYear={pickYear}
                            onFollowYear={setPickerView}
                            onBack={back}
                          />
                        </div>
                      }
                    >
                      <Button
                        variant="ghost"
                        tone="neutral"
                        size={size}
                        disabled={disabled}
                        className={calendarHeading()}
                        aria-label={`${t.calendar.pickMonth}: ${label}`}
                      >
                        <span className="truncate">{label}</span>
                      </Button>
                    </Popover>
                  }
                />
                {showToday && (
                  <IconButton
                    label={t.monthGrid.today}
                    size={size}
                    disabled={!header.canToday}
                    onClick={header.goToToday}
                  >
                    <CalendarDaysIcon />
                  </IconButton>
                )}
              </div>
              {renderHeaderActions && (
                <div className={monthGridActions()}>{renderHeaderActions(header)}</div>
              )}
            </>
          )}
        </div>
      )}
      <table className={monthGridTable()}>
        <caption className="sr-only">{`${labelProp ?? t.calendar.label} · ${label}`}</caption>
        <thead>
          <tr>
            {weekdays.map(weekday => (
              <th
                key={weekday.day}
                scope="col"
                abbr={weekday.fullLabel}
                className={monthGridWeekday()}
              >
                {renderWeekday ? renderWeekday(weekday) : weekday.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, index) => (
            <tr key={week[0]!.date}>
              {week.map(day => (
                <td
                  key={day.date}
                  data-date={day.date}
                  data-outside={day.isOutside ? '' : undefined}
                  data-today={day.isToday ? '' : undefined}
                  data-disabled={day.isDisabled ? '' : undefined}
                  className={cn(
                    monthGridCell(),
                    index === weeks.length - 1 && 'border-b-0',
                    dayClassOf(cellClass, day),
                  )}
                >
                  <div
                    data-hn-month-grid-day=""
                    className={cn(monthGridDay(), dayClassOf(dayClass, day))}
                  >
                    {(showOutsideDays || !day.isOutside) &&
                      (renderDay ? (
                        renderDay(day)
                      ) : (
                        <>
                          <div className={monthGridDayHeader()}>
                            <time
                              dateTime={day.date}
                              aria-label={day.label}
                              aria-current={day.isToday ? 'date' : undefined}
                              data-today={day.isToday ? '' : undefined}
                              data-outside={day.isOutside ? '' : undefined}
                              data-disabled={day.isDisabled ? '' : undefined}
                              className={monthGridDate()}
                            >
                              {renderDate ? renderDate(day) : day.dayLabel}
                            </time>
                            {renderDayTrailing && (
                              <div className="min-w-0 text-end">{renderDayTrailing(day)}</div>
                            )}
                          </div>
                          {children?.(day)}
                        </>
                      ))}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {renderFooter && <div className="border-line border-t p-3">{renderFooter(range)}</div>}
    </div>
  )
}
