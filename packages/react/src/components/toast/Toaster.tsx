'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import type { ComponentType } from 'react'
import { flushSync } from 'react-dom'
import { cn } from '../../lib/cn'
import { radixToastStyle } from '../../lib/radix/styles'
import { useUiLocale } from '../../locale'
import {
  ToastClose,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
} from '../../primitives/toast'
import { Button } from '../button/Button'
import { CloseButton } from '../close-button/CloseButton'
import { ToastIcon } from './ToastIcon'
import {
  dismiss,
  subscribeToasts,
  toastState,
  toastVersion,
  type ToastItem,
  type ToasterPosition,
} from './store'
import { useToastExpand } from './hooks/useToastExpand'
import { useToastLayout, VISIBLE_STACK } from './hooks/useToastLayout'

export interface ToasterProps {
  position?: ToasterPosition
  label?: string
  className?: string
}

const positionClass: Record<ToasterPosition | 'auto', string> = {
  'bottom-end': 'bottom-4 end-4 hn-scrollbar-safe',
  'bottom-start': 'bottom-4 start-4',
  'bottom-center': 'bottom-4 inset-x-0 mx-auto hn-scrollbar-safe-center',
  'top-end': 'top-4 end-4 hn-scrollbar-safe',
  'top-start': 'top-4 start-4',
  'top-center': 'top-4 inset-x-0 mx-auto hn-scrollbar-safe-center',
  auto: 'max-sm:bottom-4 max-sm:inset-x-0 max-sm:mx-auto max-sm:hn-scrollbar-safe-center sm:top-4 sm:end-4 sm:hn-scrollbar-safe',
}

function runAction(item: ToastItem, kind: 'action' | 'cancel') {
  item[kind]?.onClick?.()
  dismiss(item.id)
}

export function Toaster({ position, label, className }: ToasterProps) {
  const t = useUiLocale()
  useSyncExternalStore(subscribeToasts, toastVersion, toastVersion)
  const items = [...toastState.items]
  const { slotOf, itemStyle, setItemRef } = useToastLayout(items)
  const { expanded, enter, leave } = useToastExpand()
  const [viewport, setViewport] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!viewport) return
    const onPointerEnter = () => flushSync(() => enter('hover'))
    const onPointerLeave = () => flushSync(() => leave('hover'))
    const onFocusIn = () => flushSync(() => enter('focus'))
    const onFocusOut = () => flushSync(() => leave('focus'))
    viewport.addEventListener('pointerenter', onPointerEnter)
    viewport.addEventListener('pointerleave', onPointerLeave)
    viewport.addEventListener('focusin', onFocusIn)
    viewport.addEventListener('focusout', onFocusOut)
    return () => {
      viewport.removeEventListener('pointerenter', onPointerEnter)
      viewport.removeEventListener('pointerleave', onPointerLeave)
      viewport.removeEventListener('focusin', onFocusIn)
      viewport.removeEventListener('focusout', onFocusOut)
    }
  }, [viewport, enter, leave])

  return (
    <ToastProvider swipeDirection="right">
      {items.map(item => {
        const slot = slotOf(item)
        const Custom = item.component as ComponentType<Record<string, unknown>> | undefined
        return (
          <ToastRoot
            key={item.id}
            open={true}
            duration={Infinity}
            className="hn-toast-item group/toast outline-none"
            style={{ ...radixToastStyle, ...itemStyle(item) }}
            data-hn-behind={slot.index > 0 ? '' : undefined}
            data-hn-hidden={slot.index >= VISIBLE_STACK ? '' : undefined}
            data-hn-removed={item.open ? undefined : ''}
            tabIndex={slot.index === 0 ? 0 : -1}
            onOpenChange={value => {
              if (!value) dismiss(item.id)
            }}
          >
            <div className="hn-toast-card bg-surface border-line relative rounded-lg border p-4 shadow-md">
              {Custom ? (
                <div ref={setItemRef(item.id)} className="hn-toast-body">
                  <Custom {...item.componentProps} toastId={item.id} />
                </div>
              ) : (
                <div
                  ref={setItemRef(item.id)}
                  className="hn-toast-body flex w-full items-start gap-3"
                >
                  {item.tone !== 'neutral' && <ToastIcon tone={item.tone} />}
                  <div className="flex min-w-0 flex-1 flex-col gap-1 pe-6">
                    <ToastTitle className="text-fg font-medium">{item.message}</ToastTitle>
                    {item.description && (
                      <ToastDescription className="text-muted text-sm">
                        {item.description}
                      </ToastDescription>
                    )}
                    {(item.action || item.cancel) && (
                      <div className="mt-1.5 flex gap-(--hn-inline-gap)">
                        {item.cancel && (
                          <Button
                            size="sm"
                            variant="ghost"
                            tone="neutral"
                            onClick={() => runAction(item, 'cancel')}
                          >
                            {item.cancel.label}
                          </Button>
                        )}
                        {item.action && (
                          <Button
                            size="sm"
                            variant="soft"
                            onClick={() => runAction(item, 'action')}
                          >
                            {item.action.label}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <ToastClose asChild>
              <CloseButton className="absolute top-2 end-2 opacity-0 group-hover/toast:opacity-100 focus-visible:opacity-100" />
            </ToastClose>
          </ToastRoot>
        )
      })}
      <ToastPortal>
        <ToastViewport
          ref={setViewport}
          label={label ?? t.toast.regionLabel}
          data-pos={position ?? 'auto'}
          data-expanded={expanded ? '' : undefined}
          className={cn(
            'pointer-events-none fixed z-(--hn-z-toast) w-96 max-w-[calc(100vw-2rem)] outline-none',
            positionClass[position ?? 'auto'],
            className,
          )}
        />
      </ToastPortal>
    </ToastProvider>
  )
}
