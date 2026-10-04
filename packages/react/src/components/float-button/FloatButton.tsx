'use client'

import { useImperativeHandle, useRef, useState, type CSSProperties } from 'react'
import { useComposedRefs } from 'radix-ui/internal'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { Transition } from '../../lib/transition/Transition'
import { Button } from '../button/Button'
import { floatButton } from './float-button.variants'
import { TooltipTarget } from './TooltipTarget'
import type { FloatButtonProps } from './types'

function enter(element: HTMLElement) {
  element.removeAttribute('inert')
}

function leave(element: HTMLElement) {
  element.setAttribute('inert', '')
}

export function FloatButton({
  label,
  visible = true,
  as = 'button',
  type = 'button',
  position = 'fixed',
  placement = 'bottom-end',
  offset,
  size = 'md',
  shape = 'circle',
  extended,
  variant = 'solid',
  tone = 'accent',
  tooltip = true,
  tooltipSide = 'top',
  loading,
  disabled,
  ripple = true,
  className,
  style,
  children,
  ref,
  ...attrs
}: FloatButtonProps) {
  const element = useRef<HTMLElement | null>(null)
  const [target, setTarget] = useState<HTMLElement | null>(null)
  const buttonRef = useComposedRefs(element, setTarget)
  const resolvedOffset =
    offset === undefined
      ? undefined
      : typeof offset === 'number'
        ? Number.isFinite(offset)
          ? `${Math.max(0, offset)}px`
          : undefined
        : offset
  const content = hasContent(children) ? children : <></>
  const latest = useRef({ disabled, loading })
  latest.current = { disabled, loading }

  useImperativeHandle(
    ref,
    () => ({
      get element() {
        return element.current ?? undefined
      },
      focus() {
        if (!latest.current.disabled && !latest.current.loading)
          element.current?.focus({ preventScroll: true })
      },
    }),
    [],
  )

  return (
    <>
      <Transition
        show={visible}
        enterActiveClass="hn-transition-base"
        enterFromClass="scale-90 opacity-0"
        leaveActiveClass="hn-transition pointer-events-none"
        leaveToClass="scale-90 opacity-0"
        onBeforeEnter={enter}
        onBeforeLeave={leave}
        onLeaveCancelled={enter}
      >
        <Button
          {...attrs}
          ref={buttonRef}
          data-hn-float-button=""
          as={as}
          type={type}
          iconOnly={!extended}
          aria-label={label}
          variant={variant}
          tone={tone}
          loading={loading}
          disabled={disabled || !visible}
          ripple={ripple}
          data-position={position}
          data-placement={placement}
          className={cn(floatButton({ position, size, shape, extended, variant }), className)}
          style={{ '--hn-float-offset': resolvedOffset, ...style } as CSSProperties}
          icon={extended ? content : undefined}
        >
          {extended ? <span className="min-w-0 truncate">{label}</span> : content}
        </Button>
      </Transition>
      {visible ? (
        <TooltipTarget
          target={target}
          options={tooltip && !extended ? { content: label, side: tooltipSide } : { content: '' }}
        />
      ) : null}
    </>
  )
}
