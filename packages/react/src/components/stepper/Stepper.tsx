'use client'

import { useId, useImperativeHandle, useRef, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { useUiLocale } from '../../locale'
import { StepperRoot } from '../../primitives/stepper'
import { StepperStep } from './StepperStep'
import { stepper } from './stepper.variants'
import { useDirection } from './hooks/useDirection'
import { useStepper } from './hooks/useStepper'
import type { StepperItem, StepperNavigation, StepperProps } from './types'

export function Stepper<T extends StepperItem = StepperItem>({
  items,
  value,
  defaultValue = 1,
  onValueChange,
  orientation = 'horizontal',
  size,
  linear = true,
  disabled = false,
  beforeChange,
  label,
  dir,
  onError,
  children,
  renderIndicator,
  renderTitle,
  renderDescription,
  className,
  ref,
  ...attrs
}: StepperProps<T>) {
  const t = useUiLocale()
  const id = useId()
  const { root, direction, rootDirection } = useDirection<HTMLDivElement>(dir)
  const { step, pending, entries, navigation, next, prev, goTo, canNext, canPrev, store } =
    useStepper<T>(
      { items, value, defaultValue, linear, disabled, beforeChange },
      next => onValueChange?.(next),
      error => onError?.(error),
    )
  const panel = typeof children === 'function' || hasContent(children)
  const view = useRef({ step, canNext, canPrev })
  view.current = { step, canNext, canPrev }

  useImperativeHandle(
    ref,
    () => ({
      get step() {
        return view.current.step
      },
      get pending() {
        return store.current.pending
      },
      next,
      prev,
      goTo,
      get canNext() {
        return view.current.canNext
      },
      get canPrev() {
        return view.current.canPrev
      },
    }),
    [next, prev, goTo, store],
  )

  return (
    <div
      ref={root}
      data-hn-stepper=""
      dir={rootDirection}
      aria-busy={pending || undefined}
      {...attrs}
      className={cn(stepper({ size }), className)}
    >
      <StepperRoot
        value={step}
        orientation={orientation}
        dir={direction}
        linear={linear}
        aria-label={label ?? t.stepper.label}
        className="min-w-0 [&>[role=status]]:hidden"
        onValueChange={value => value !== undefined && goTo(value)}
      >
        <ol
          role="list"
          className="hn-stepper-list m-0 grid min-w-0 list-none p-0"
          data-orientation={orientation}
        >
          {entries.map(entry => (
            <StepperStep<T>
              key={entry.step}
              id={`${id}-${entry.step}`}
              entry={entry}
              orientation={orientation}
              pending={pending}
              last={entry.step === entries.length}
              panelId={panel ? `${id}-panel` : undefined}
              onSelect={goTo}
              renderIndicator={renderIndicator}
              renderTitle={renderTitle}
              renderDescription={renderDescription}
            />
          ))}
        </ol>
      </StepperRoot>
      {panel && (
        <div
          id={`${id}-panel`}
          role={step ? 'region' : undefined}
          aria-labelledby={step ? `${id}-${step}-title` : undefined}
          className="min-w-0"
        >
          {typeof children === 'function'
            ? (children as (props: StepperNavigation<T>) => ReactNode)(navigation)
            : children}
        </div>
      )}
      {entries.length > 0 && (
        <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {t.stepper.progress(step, entries.length)}
        </span>
      )}
    </div>
  )
}
