'use client'

import { memo, useEffect, useId, useRef } from 'react'
import { cn } from '../../lib/cn'
import { prefersReducedMotion } from '../../motion'
import { ScrollArea } from '../scroll-area/ScrollArea'
import { Highlight } from '../highlight/Highlight'
import { Ripple } from '../ripple/Ripple'
import type { LightboxItem } from './types'

export interface LightboxThumbsProps {
  items: LightboxItem[]
  index: number
  onSelect?: (index: number) => void
}

function LightboxThumbsImpl({ items, index, onSelect }: LightboxThumbsProps) {
  const select = useRef(onSelect)
  select.current = onSelect
  const buttons = useRef<HTMLElement[]>([])
  const highlightId = useId()

  useEffect(() => {
    buttons.current[index]?.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }, [index, items.length])

  return (
    <ScrollArea direction="horizontal" scrollbar={false} className="max-w-full">
      <div data-hn-thumbs="" className="relative isolate flex w-max gap-2 px-4 py-3">
        {items.map((item, at) => (
          <button
            key={item.id}
            ref={el => {
              if (el instanceof HTMLElement) buttons.current[at] = el
            }}
            type="button"
            aria-label={item.alt}
            aria-current={at === index ? 'true' : undefined}
            className={cn(
              'hn-interactive hn-state-layer hn-press-none hn-transition relative z-[1] size-14 shrink-0 overflow-hidden rounded-md',
              at === index ? 'z-0 opacity-100' : 'opacity-60',
            )}
            onClick={() => select.current?.(at)}
          >
            <Ripple />
            <img
              src={item.src}
              alt=""
              draggable="false"
              className="relative -z-10 size-full object-cover"
            />
            {at === index && (
              <Highlight
                id={highlightId}
                axis="x"
                className="ring-accent absolute inset-0 rounded-md ring-2 ring-inset"
              />
            )}
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}

export const LightboxThumbs = memo(
  LightboxThumbsImpl,
  (previous, next) => previous.items === next.items && previous.index === next.index,
)
