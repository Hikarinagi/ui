'use client'

import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react'
import { cn } from '../../lib/cn'
import { Transition } from '../../lib/transition/Transition'
import { useUiLocale } from '../../locale'
import { anchorEntries } from '../../../../shared/src/lib/anchor'
import { Highlight } from '../highlight/Highlight'
import { useAnchorFollow } from './hooks/useAnchorFollow'
import { useScrollSpy } from './hooks/useScrollSpy'
import type { AnchorItem, AnchorSlotItem } from './types'

export type { AnchorItem, AnchorSlotItem } from './types'

export interface AnchorHandle {
  readonly current: string | undefined
}

export interface AnchorTrailingProps<T extends AnchorItem> {
  item: AnchorSlotItem<T>
  active: boolean
}

export interface AnchorProps<T extends AnchorItem = AnchorItem> extends Omit<
  HTMLAttributes<HTMLElement>,
  'onChange' | 'children'
> {
  items: T[]
  label?: string
  autoScroll?: boolean
  onChange?: (current: string | undefined) => void
  renderTrailing?: (props: AnchorTrailingProps<T>) => ReactNode
  ref?: Ref<AnchorHandle>
  [attribute: `data-${string}`]: string | undefined
}

export function Anchor<T extends AnchorItem = AnchorItem>({
  items,
  label,
  autoScroll = true,
  onChange,
  renderTrailing,
  className,
  ref,
  ...attrs
}: AnchorProps<T>) {
  const t = useUiLocale()
  const entries = useMemo(() => anchorEntries(items), [items])
  const { visible, covered, current, span, jump } = useScrollSpy(entries)
  const lastCovered = covered.at(-1)?.id
  const root = useRef<HTMLElement>(null)
  useAnchorFollow(root, current, lastCovered, autoScroll)

  const emitted = useRef(current)
  const notify = useRef(onChange)
  notify.current = onChange
  useEffect(() => {
    if (emitted.current === current) return
    emitted.current = current
    notify.current?.(current)
  }, [current])

  useImperativeHandle(ref, () => ({ current }), [current])

  return (
    <nav ref={root} aria-label={label ?? t.anchor.navLabel} {...attrs} className={cn(className)}>
      <ul className="border-line relative grid grid-cols-1 border-s">
        <Transition
          show={!!span}
          enterActiveClass="hn-transition-base"
          enterFromClass="opacity-0"
          leaveActiveClass="hn-transition"
          leaveToClass="opacity-0"
        >
          <Highlight
            as="li"
            axis="y"
            role="presentation"
            style={{ gridRow: span }}
            className="bg-accent col-start-1 -ms-px w-0.5 self-stretch justify-self-start rounded-full"
          />
        </Transition>
        {entries.map((entry, index) => (
          <li key={entry.id} className="col-start-1" style={{ gridRow: index + 1 }}>
            <a
              href={`#${entry.id}`}
              aria-current={current === entry.id ? 'location' : undefined}
              className={cn(
                'hn-link flex items-center gap-(--hn-control-gap) py-1 text-sm',
                entry.depth === 0 ? 'ps-3' : 'ps-6',
                visible.has(entry.id)
                  ? 'font-medium [--hn-link-color:var(--hn-fg-default)]'
                  : '[--hn-link-color:var(--hn-fg-muted)]',
              )}
              onClick={event => jump(event, entry.id)}
            >
              <span className="min-w-0 flex-1 wrap-break-word">{entry.label}</span>
              {renderTrailing ? (
                <span className="flex shrink-0 items-center empty:hidden">
                  {renderTrailing({ item: entry.item, active: current === entry.id })}
                </span>
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
