'use client'

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type Ref,
} from 'react'
import { cn } from '../../lib/cn'
import { useUiLocale } from '../../locale'
import { Button } from '../button/Button'
import {
  animateLineClamp,
  lineClampCount,
  measureLineClamp,
  revealLineClamp,
} from '../../../../shared/src/lib/line-clamp'
import { lineClampContent, lineClampRoot, lineClampToggle } from './line-clamp.variants'
import { useComposedRefs } from '../../primitives/utils/compose-refs'
import { useControllableState } from '../../primitives/utils/controllable-state'
import { useLayoutEffect } from '../../primitives/utils/layout-effect'

export interface LineClampProps extends HTMLAttributes<HTMLDivElement> {
  lines?: number
  expanded?: boolean
  defaultExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  expandLabel?: string
  collapseLabel?: string
  ref?: Ref<HTMLDivElement>
}

export function LineClamp({
  lines,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  expandLabel,
  collapseLabel,
  className,
  children,
  ref,
  ...attrs
}: LineClampProps) {
  const t = useUiLocale()
  const id = useId()
  const root = useRef<HTMLDivElement>(null)
  const composedRef = useComposedRefs(ref, root)
  const content = useRef<HTMLDivElement>(null)
  const [truncated, setTruncated] = useState<boolean | null>(null)
  const [expanded = false, setExpanded] = useControllableState({
    prop: expandedProp,
    defaultProp: defaultExpanded,
    onChange: onExpandedChange,
    caller: 'LineClamp',
  })
  const count = lineClampCount(lines)
  const shown = useRef(expanded)
  const reveal = useRef(false)
  const stop = useRef<(() => void) | undefined>(undefined)

  function measure() {
    if (!content.current) return
    const next = measureLineClamp(content.current)
    if (next !== null) setTruncated(next)
  }

  useLayoutEffect(() => {
    const element = content.current
    if (element && shown.current !== expanded) {
      shown.current = expanded
      const scroll = reveal.current && !expanded
      reveal.current = false
      stop.current?.()
      stop.current = animateLineClamp(element, expanded, () => {
        measure()
        if (scroll) revealLineClamp(root.current)
      })
    }
    measure()
  })

  useEffect(() => {
    const element = content.current
    if (!element) return
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    void document.fonts?.ready.then(measure)
    return () => {
      observer.disconnect()
      stop.current?.()
    }
  }, [])

  function toggle() {
    reveal.current = expanded
    setExpanded(!expanded)
  }

  return (
    <div
      data-expanded={expanded ? '' : undefined}
      data-truncated={truncated === null ? undefined : `${truncated}`}
      {...attrs}
      ref={composedRef}
      className={cn(lineClampRoot(), className)}
    >
      <div
        id={id}
        ref={content}
        data-expanded={expanded ? '' : undefined}
        style={{ '--hn-line-clamp': count } as CSSProperties}
        className={lineClampContent()}
      >
        {children}
      </div>
      <span className={lineClampToggle()}>
        <Button
          variant="link"
          size="sm"
          aria-expanded={expanded}
          aria-controls={id}
          onClick={toggle}
        >
          {expanded ? (collapseLabel ?? t.lineClamp.collapse) : (expandLabel ?? t.lineClamp.expand)}
        </Button>
      </span>
    </div>
  )
}
