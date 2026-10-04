'use client'

import { useControllableState, useComposedRefs } from 'radix-ui/internal'
import { useRef, type HTMLAttributes, type Ref } from 'react'
import { cn } from '../../lib/cn'
import { useUiLocale } from '../../locale'
import { useReveal } from './hooks/useReveal'
import { useSpoiler } from './hooks/useSpoiler'

export interface SpoilerProps extends HTMLAttributes<HTMLSpanElement> {
  revealOn?: 'click' | 'hover'
  forceFallback?: boolean
  hidden?: boolean
  defaultHidden?: boolean
  onHiddenChange?: (hidden: boolean) => void
  ref?: Ref<HTMLSpanElement>
}

export function Spoiler({
  revealOn = 'click',
  forceFallback,
  hidden: hiddenProp,
  defaultHidden = true,
  onHiddenChange,
  className,
  children,
  ref,
  ...attrs
}: SpoilerProps) {
  const t = useUiLocale()
  const host = useRef<HTMLSpanElement>(null)
  const composedRef = useComposedRefs(ref, host)
  const [hidden, setHidden] = useControllableState({
    prop: hiddenProp,
    defaultProp: defaultHidden,
    onChange: onHiddenChange,
    caller: 'Spoiler',
  })
  const usesFallback = useSpoiler(host, hidden, !!forceFallback)

  const label = hidden ? t.spoiler.revealLabel : t.spoiler.hideLabel

  useReveal(host, hidden, setHidden, revealOn)

  return (
    <span
      ref={composedRef}
      data-hidden={hidden ? '' : undefined}
      role={revealOn === 'click' ? 'button' : undefined}
      tabIndex={0}
      aria-label={label}
      aria-expanded={!hidden}
      {...attrs}
      className={cn(usesFallback ? 'hn-spoiler-fb' : 'hn-spoiler', className)}
    >
      <span className="hn-spoiler-inner">{children}</span>
    </span>
  )
}
