'use client'

import type { ComponentType, HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { lucide } from '../../lib/icon'
import { Button } from '../button/Button'
import { IconButton } from '../icon-button/IconButton'
import { calendarHeader, calendarHeading, type CalendarVariants } from './calendar.variants'

const ChevronLeftIcon = lucide(ChevronLeft)
const ChevronRightIcon = lucide(ChevronRight)

type Paging = ComponentType<{ asChild?: boolean; children?: ReactNode }>

export interface CalendarHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  prev?: Paging
  next?: Paging
  prevDisabled?: boolean
  nextDisabled?: boolean
  prevLabel: string
  nextLabel: string
  heading: string
  pickLabel?: string
  size?: CalendarVariants['size']
  disabled?: boolean
  headingContent?: ReactNode
  onPick?: () => void
  onPrev?: () => void
  onNext?: () => void
}

export function CalendarHeader({
  prev: Prev,
  next: Next,
  prevDisabled,
  nextDisabled,
  prevLabel,
  nextLabel,
  heading,
  pickLabel,
  size,
  disabled,
  headingContent,
  onPick,
  onPrev,
  onNext,
  className,
  ...attrs
}: CalendarHeaderProps) {
  return (
    <div {...attrs} className={clsx(calendarHeader(), className)}>
      {Prev ? (
        <Prev asChild>
          <IconButton label={prevLabel} size={size}>
            <ChevronLeftIcon className="rtl:rotate-180" />
          </IconButton>
        </Prev>
      ) : (
        <IconButton
          label={prevLabel}
          size={size}
          disabled={disabled || prevDisabled}
          onClick={() => onPrev?.()}
        >
          <ChevronLeftIcon className="rtl:rotate-180" />
        </IconButton>
      )}
      {headingContent !== undefined ? (
        headingContent
      ) : pickLabel ? (
        <Button
          variant="ghost"
          tone="neutral"
          size={size}
          className={calendarHeading()}
          aria-label={pickLabel}
          disabled={disabled}
          onClick={() => onPick?.()}
        >
          {heading}
        </Button>
      ) : (
        <span className={calendarHeading({ still: true })}>{heading}</span>
      )}
      {Next ? (
        <Next asChild>
          <IconButton label={nextLabel} size={size}>
            <ChevronRightIcon className="rtl:rotate-180" />
          </IconButton>
        </Next>
      ) : (
        <IconButton
          label={nextLabel}
          size={size}
          disabled={disabled || nextDisabled}
          onClick={() => onNext?.()}
        >
          <ChevronRightIcon className="rtl:rotate-180" />
        </IconButton>
      )}
    </div>
  )
}
