'use client'

import type { CSSProperties, HTMLAttributes, KeyboardEvent, Ref } from 'react'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import type { PageFunction } from './use-calendar'

export const hiddenHeadingStyle: CSSProperties = {
  border: '0px',
  clip: 'rect(0px, 0px, 0px, 0px)',
  clipPath: 'inset(50%)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: '0px',
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
}

export function HiddenHeading({ label }: { label: string }) {
  return (
    <div style={hiddenHeadingStyle}>
      <div role="heading" aria-level={2}>
        {label}
      </div>
    </div>
  )
}

const GRID_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Enter']

export function matchesGridKey(event: KeyboardEvent, extra: string[] = []) {
  return GRID_KEYS.includes(event.key) || extra.includes(event.key)
}

export interface CalendarPartProps extends PrimitiveProps, HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function GridTable({
  as,
  asChild,
  disabled,
  readonly,
  ...props
}: CalendarPartProps & { disabled: boolean; readonly: boolean }) {
  return (
    <Primitive
      as={as}
      asChild={asChild}
      tabIndex={-1}
      role="application"
      aria-readonly={readonly ? true : undefined}
      aria-disabled={disabled ? true : undefined}
      data-readonly={readonly ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      {...props}
    />
  )
}

export interface CalendarPagingProps extends CalendarPartProps {
  nextPage?: PageFunction
  prevPage?: PageFunction
}
