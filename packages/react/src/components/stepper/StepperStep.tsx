'use client'

import clsx from 'clsx'
import { CircleAlert, Check } from 'lucide-react'
import type { ReactNode } from 'react'
import { hasContent } from '../../lib/content'
import { lucide } from '../../lib/icon'
import { useUiLocale } from '../../locale'
import {
  StepperDescription,
  StepperIndicator,
  StepperItem as PrimitiveStepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '../../primitives/stepper'
import { Spinner } from '../spinner/Spinner'
import { stepperIndicator, stepperTrigger } from './stepper.variants'
import type { StepperItem, StepperOrientation, StepperSlotProps } from './types'

const CircleAlertIcon = lucide(CircleAlert)
const CheckIcon = lucide(Check)

export interface StepperStepProps<T extends StepperItem = StepperItem> {
  entry: StepperSlotProps<T>
  id: string
  panelId?: string
  pending: boolean
  last: boolean
  orientation: StepperOrientation
  onSelect: (step: number) => void
  renderIndicator?: (props: StepperSlotProps<T>) => ReactNode
  renderTitle?: (props: StepperSlotProps<T>) => ReactNode
  renderDescription?: (props: StepperSlotProps<T>) => ReactNode
}

function slot<P>(render: ((props: P) => ReactNode) | undefined, props: P, fallback: ReactNode) {
  if (!render) return fallback
  const content = render(props)
  return hasContent(content) ? content : fallback
}

export function StepperStep<T extends StepperItem = StepperItem>({
  entry,
  id,
  panelId,
  pending,
  last,
  orientation,
  onSelect,
  renderIndicator,
  renderTitle,
  renderDescription,
}: StepperStepProps<T>) {
  const t = useUiLocale()
  const described =
    [
      entry.item.description || renderDescription ? `${id}-description` : undefined,
      entry.state === 'error' || entry.state === 'completed' ? `${id}-status` : undefined,
    ]
      .filter(Boolean)
      .join(' ') || undefined

  return (
    <PrimitiveStepperItem
      as="li"
      step={entry.step}
      disabled={entry.disabled}
      completed={entry.state === 'completed'}
      aria-current={undefined}
      data-hn-state={entry.state}
      className="hn-stepper-item min-w-0"
    >
      <StepperTrigger
        id={`${id}-trigger`}
        aria-labelledby={`${id}-title`}
        aria-describedby={described}
        aria-controls={panelId}
        aria-current={entry.active ? 'step' : undefined}
        aria-disabled={pending || undefined}
        data-disabled={entry.disabled || pending ? '' : undefined}
        className={stepperTrigger({ orientation })}
        onMouseDownCapture={event => event.stopPropagation()}
        onClick={() => onSelect(entry.step)}
      >
        <StepperIndicator className={stepperIndicator({ state: entry.state })} aria-hidden="true">
          {slot(
            renderIndicator,
            entry,
            pending && entry.active ? (
              <Spinner size="sm" />
            ) : entry.state === 'error' ? (
              <CircleAlertIcon />
            ) : entry.state === 'completed' ? (
              <CheckIcon />
            ) : (
              entry.step
            ),
          )}
        </StepperIndicator>
        <span className="flex min-w-0 flex-1 flex-col justify-center gap-1 self-stretch wrap-anywhere">
          <StepperTitle
            as="span"
            id={`${id}-title`}
            className={clsx(
              'font-medium',
              entry.state === 'error' ? 'text-danger-text' : undefined,
            )}
          >
            {slot(renderTitle, entry, entry.item.title)}
          </StepperTitle>
          {entry.item.description || renderDescription ? (
            <StepperDescription as="span" id={`${id}-description`} className="text-muted text-xs">
              {slot(renderDescription, entry, entry.item.description)}
            </StepperDescription>
          ) : null}
          {entry.state === 'error' || entry.state === 'completed' ? (
            <span id={`${id}-status`} className="sr-only">
              {entry.state === 'error' ? t.stepper.error : t.stepper.completed}
            </span>
          ) : null}
        </span>
      </StepperTrigger>
      {!last && (
        <StepperSeparator
          className={clsx(
            'hn-stepper-separator hn-transition-base',
            entry.state === 'completed' ? 'bg-accent' : 'bg-line',
          )}
        />
      )}
    </PrimitiveStepperItem>
  )
}
