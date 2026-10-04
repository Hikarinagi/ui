'use client'

import { createContext, useContext, useLayoutEffect, useRef, useState, type Ref } from 'react'
import { TooltipRoot, TooltipTrigger } from '../../primitives/tooltip'
import { TooltipBubble } from '../tooltip/TooltipBubble'
import { useTooltipProviderPresence } from '../tooltip/context'
import type { TooltipProps } from '../tooltip/types'

export interface TooltipTargetOptions extends Omit<TooltipProps, 'content' | 'open'> {
  content: string
}

type Handler = (event: Event) => void

interface ExternalTargetProps {
  ref?: Ref<HTMLElement>
  'aria-describedby'?: string
  onClick?: Handler
  onFocus?: Handler
  onBlur?: Handler
  onPointerMove?: Handler
  onPointerLeave?: Handler
  onPointerDown?: Handler
}

const EVENTS = {
  pointermove: 'onPointerMove',
  pointerleave: 'onPointerLeave',
  pointerdown: 'onPointerDown',
  focus: 'onFocus',
  blur: 'onBlur',
  click: 'onClick',
} as const

const TargetContext = createContext<HTMLElement | null>(null)
const GRACE = 'data-grace-area-trigger'

function assign(ref: Ref<HTMLElement> | undefined, value: HTMLElement | null) {
  if (typeof ref === 'function') ref(value)
  else if (ref) ref.current = value
}

function ExternalTarget(props: ExternalTargetProps) {
  const target = useContext(TargetContext)!
  const latest = useRef(props)
  latest.current = props
  const described = useRef<string | undefined>(undefined)
  const { ref } = props

  useLayoutEffect(() => {
    assign(ref, target)
    return () => assign(ref, null)
  }, [ref, target])

  useLayoutEffect(() => {
    const previous = target.getAttribute(GRACE)
    target.setAttribute(GRACE, '')
    const listeners = Object.entries(EVENTS).map(([event, prop]) => {
      const listener = (nativeEvent: Event) => latest.current[prop]?.(nativeEvent)
      target.addEventListener(event, listener)
      return () => target.removeEventListener(event, listener)
    })
    return () => {
      listeners.forEach(remove => remove())
      latest.current.onBlur?.(new FocusEvent('blur'))
      describe(target, described, undefined)
      if (previous === null) target.removeAttribute(GRACE)
      else target.setAttribute(GRACE, previous)
    }
  }, [target])

  useLayoutEffect(() => {
    describe(target, described, props['aria-describedby'])
  })

  return null
}

function describe(
  target: HTMLElement,
  described: { current: string | undefined },
  id: string | undefined,
) {
  const ids = new Set((target.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean))
  if (described.current) ids.delete(described.current)
  if (id) ids.add(id)
  described.current = id
  if (ids.size) target.setAttribute('aria-describedby', [...ids].join(' '))
  else target.removeAttribute('aria-describedby')
}

function TooltipTargetRoot({
  target,
  options,
}: {
  target: HTMLElement
  options: TooltipTargetOptions
}) {
  const [open, setOpen] = useState(false)
  const disabled = !!options.disabled || !options.content.trim()
  return (
    <TooltipRoot open={open} onOpenChange={setOpen} disabled={disabled} ignoreNonKeyboardFocus>
      <TargetContext value={target}>
        <TooltipTrigger key={disabled ? 'disabled' : 'enabled'} as={ExternalTarget} />
      </TargetContext>
      <TooltipBubble {...options} />
    </TooltipRoot>
  )
}

export function TooltipTarget({
  target,
  options,
}: {
  target: HTMLElement | null
  options: TooltipTargetOptions
}) {
  const provided = useTooltipProviderPresence()
  if (!provided || !target) return null
  return <TooltipTargetRoot target={target} options={options} />
}
