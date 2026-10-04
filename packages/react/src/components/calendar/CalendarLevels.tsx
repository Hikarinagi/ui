'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { DateValue } from '@internationalized/date'
import { Transition } from '../../lib/transition/Transition'
import { useUiLocale } from '../../locale'
import {
  formatDigits,
  formatMonthName,
  formatYearHeading,
  formatYearsHeading,
} from '../../../../shared/src/lib/calendar/format'
import {
  MonthPickerCell,
  MonthPickerCellTrigger,
  MonthPickerGrid,
  MonthPickerGridBody,
  MonthPickerGridRow,
  MonthPickerNext,
  MonthPickerPrev,
  MonthPickerRoot,
  YearPickerCell,
  YearPickerCellTrigger,
  YearPickerGrid,
  YearPickerGridBody,
  YearPickerGridRow,
  YearPickerNext,
  YearPickerPrev,
  YearPickerRoot,
} from '../../primitives/calendar'
import { CalendarHeader } from './CalendarHeader'
import type { CalendarLevel } from './hooks/useCalendarLevels'
import {
  calendarGrid,
  calendarPicker,
  calendarUnit,
  calendarUnitCell,
  calendarUnits,
  type CalendarVariants,
} from './calendar.variants'

type Picked = DateValue | DateValue[] | undefined

export interface CalendarLevelsProps {
  level: CalendarLevel
  onLevelChange: (level: CalendarLevel) => void
  view: DateValue
  size?: CalendarVariants['size']
  minValue?: DateValue
  maxValue?: DateValue
  disabled?: boolean
  dir?: 'ltr' | 'rtl'
  onPickMonth?: (value: Picked) => void
  onPickYear?: (value: Picked) => void
  onFollowYear?: (date: DateValue) => void
  onBack?: () => void
  onEntered?: () => void
  children?: ReactNode
}

const LEVELS: CalendarLevel[] = ['day', 'month', 'year']

export function CalendarLevels({
  level,
  onLevelChange,
  view,
  size,
  minValue,
  maxValue,
  disabled,
  dir,
  onPickMonth,
  onPickYear,
  onFollowYear,
  onBack,
  onEntered,
  children,
}: CalendarLevelsProps) {
  const t = useUiLocale()
  const [shown, setShown] = useState<CalendarLevel>(level)
  const levelRef = useRef(level)
  levelRef.current = level
  const back = useRef(onBack)
  back.current = onBack
  const monthRoot = useRef<HTMLElement | null>(null)
  const yearRoot = useRef<HTMLElement | null>(null)
  const yearHeading = formatYearHeading(t.tag, view)

  useEffect(() => {
    const target = window
    function listener(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      const origin = event.target as Node | null
      const inside = [monthRoot.current, yearRoot.current].some(
        root => !!root && !!origin && root.contains(origin),
      )
      if (!inside) return
      event.stopPropagation()
      event.preventDefault()
      back.current?.()
    }
    target.addEventListener('keydown', listener, true)
    return () => target.removeEventListener('keydown', listener, true)
  }, [])

  function transition(key: CalendarLevel, element: ReactNode) {
    return (
      <Transition
        key={key}
        show={shown === key && level === key}
        enterActiveClass="hn-transition-base"
        enterFromClass="scale-90 opacity-0"
        leaveActiveClass="hn-transition"
        leaveToClass="scale-90 opacity-0"
        onAfterLeave={() => setShown(levelRef.current)}
        onAfterEnter={() => onEntered?.()}
      >
        {element as never}
      </Transition>
    )
  }

  return (
    <>
      {LEVELS.map(key => {
        if (key === 'day')
          return transition(key, <div className={calendarPicker()}>{children}</div>)
        if (key === 'month')
          return transition(
            key,
            <MonthPickerRoot
              ref={monthRoot}
              placeholder={view}
              dir={dir}
              value={view}
              minValue={minValue}
              maxValue={maxValue}
              locale={t.tag}
              calendarLabel={t.calendar.label}
              disabled={disabled}
              preventDeselect
              initialFocus
              className={calendarPicker()}
              onValueChange={value => onPickMonth?.(value)}
              onPlaceholderChange={value => onFollowYear?.(value)}
            >
              {({ grid: months }) => (
                <>
                  <CalendarHeader
                    prev={MonthPickerPrev}
                    next={MonthPickerNext}
                    prevLabel={t.calendar.prevYear}
                    nextLabel={t.calendar.nextYear}
                    heading={yearHeading}
                    pickLabel={t.calendar.pickYear}
                    size={size}
                    disabled={disabled}
                    onPick={() => onLevelChange('year')}
                  />
                  <div className={calendarUnits()}>
                    <MonthPickerGrid className={calendarGrid({ units: true })}>
                      <MonthPickerGridBody>
                        {months.rows.map((row, index) => (
                          <MonthPickerGridRow key={index}>
                            {row.map(month => (
                              <MonthPickerCell
                                key={month.toString()}
                                date={month}
                                className={calendarUnitCell()}
                              >
                                <MonthPickerCellTrigger month={month} className={calendarUnit()}>
                                  {formatMonthName(t.tag, month)}
                                </MonthPickerCellTrigger>
                              </MonthPickerCell>
                            ))}
                          </MonthPickerGridRow>
                        ))}
                      </MonthPickerGridBody>
                    </MonthPickerGrid>
                  </div>
                </>
              )}
            </MonthPickerRoot>,
          )
        return transition(
          key,
          <YearPickerRoot
            ref={yearRoot}
            placeholder={view}
            dir={dir}
            value={view}
            minValue={minValue}
            maxValue={maxValue}
            locale={t.tag}
            calendarLabel={t.calendar.label}
            disabled={disabled}
            yearsPerPage={12}
            preventDeselect
            initialFocus
            className={calendarPicker()}
            onValueChange={value => onPickYear?.(value)}
            onPlaceholderChange={value => onFollowYear?.(value)}
          >
            {({ grid: years }) => (
              <>
                <CalendarHeader
                  prev={YearPickerPrev}
                  next={YearPickerNext}
                  prevLabel={t.calendar.prevYears}
                  nextLabel={t.calendar.nextYears}
                  heading={formatYearsHeading(t.tag, years.cells)}
                  size={size}
                />
                <div className={calendarUnits()}>
                  <YearPickerGrid className={calendarGrid({ units: true })}>
                    <YearPickerGridBody>
                      {years.rows.map((row, index) => (
                        <YearPickerGridRow key={index}>
                          {row.map(year => (
                            <YearPickerCell
                              key={year.toString()}
                              date={year}
                              className={calendarUnitCell()}
                            >
                              <YearPickerCellTrigger year={year} className={calendarUnit()}>
                                {formatDigits(t.tag, year.year)}
                              </YearPickerCellTrigger>
                            </YearPickerCell>
                          ))}
                        </YearPickerGridRow>
                      ))}
                    </YearPickerGridBody>
                  </YearPickerGrid>
                </div>
              </>
            )}
          </YearPickerRoot>,
        )
      })}
    </>
  )
}
