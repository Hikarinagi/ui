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
  lineClampCount,
  measureLineClamp,
  revealLineClamp,
} from '../../../../shared/src/lib/line-clamp'
import { lineClampContent, lineClampRoot } from './line-clamp.variants'
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

const clampClass = lineClampContent({ clamped: true })

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
  const [truncated, setTruncated] = useState(false)
  const [expanded = false, setExpanded] = useControllableState({
    prop: expandedProp,
    defaultProp: defaultExpanded,
    onChange: onExpandedChange,
    caller: 'LineClamp',
  })
  const count = lineClampCount(lines)
  const collapsing = useRef(false)

  function measure() {
    if (content.current) setTruncated(measureLineClamp(content.current, clampClass))
  }

  useLayoutEffect(measure)

  useEffect(() => {
    const element = content.current
    if (!element) return
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    void document.fonts?.ready.then(measure)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (expanded || !collapsing.current) return
    collapsing.current = false
    revealLineClamp(root.current)
  }, [expanded])

  function toggle() {
    collapsing.current = expanded
    setExpanded(!expanded)
  }

  return (
    <div {...attrs} ref={composedRef} className={cn(lineClampRoot(), className)}>
      <div
        id={id}
        ref={content}
        data-expanded={expanded ? '' : undefined}
        style={{ '--hn-line-clamp': count } as CSSProperties}
        className={lineClampContent({ clamped: !expanded })}
      >
        {children}
      </div>
      {truncated && (
        <Button
          variant="link"
          size="sm"
          aria-expanded={expanded}
          aria-controls={id}
          onClick={toggle}
        >
          {expanded ? (collapseLabel ?? t.lineClamp.collapse) : (expandLabel ?? t.lineClamp.expand)}
        </Button>
      )}
    </div>
  )
}
