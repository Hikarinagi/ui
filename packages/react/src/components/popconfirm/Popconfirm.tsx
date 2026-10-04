'use client'

import { useId, useRef, useState, type ReactNode } from 'react'
import { useControllableState } from 'radix-ui/internal'
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from '../../primitives/popover'
import { cn } from '../../lib/cn'
import { useUiLocale } from '../../locale'
import { Button } from '../button/Button'
import { Card } from '../card/Card'
import { Text } from '../text/Text'

export interface PopconfirmProps {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  tone?: 'accent' | 'danger'
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  onConfirm?: () => unknown
  onCancel?: () => void
  className?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  content?: ReactNode
  children?: ReactNode
}

export function Popconfirm({
  title,
  description,
  confirmText,
  cancelText,
  tone = 'accent',
  side = 'bottom',
  align = 'center',
  sideOffset = 8,
  onConfirm,
  onCancel,
  className,
  open: openProp,
  defaultOpen,
  onOpenChange,
  content,
  children,
}: PopconfirmProps) {
  const [open, setOpen] = useControllableState<boolean | undefined>({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: value => {
      if (value !== undefined) onOpenChange?.(value)
    },
    caller: 'Popconfirm',
  })
  const [busy, setBusy] = useState(false)
  const pending = useRef(false)
  const t = useUiLocale()
  const titleId = useId()
  const descriptionId = useId()

  const pressOrigin =
    side === 'left'
      ? 'right'
      : side === 'right'
        ? 'left'
        : align === 'start'
          ? 'left'
          : align === 'end'
            ? 'right'
            : 'center'

  function guard(event: Event) {
    if (pending.current) event.preventDefault()
  }

  function cancel() {
    onCancel?.()
    setOpen(false)
  }

  async function confirm() {
    if (pending.current) return
    const result = onConfirm?.()
    if (result instanceof Promise) {
      pending.current = true
      setBusy(true)
      try {
        await result
      } finally {
        pending.current = false
        setBusy(false)
      }
    }
    setOpen(false)
  }

  return (
    <PopoverRoot open={open ?? false} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild style={{ transformOrigin: pressOrigin }}>
        {children}
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
          asChild
          side={side}
          align={align}
          sideOffset={sideOffset}
          aria-describedby={description ? `${titleId} ${descriptionId}` : titleId}
          onEscapeKeyDown={guard}
          onInteractOutside={guard}
        >
          <Card
            data-hn-popconfirm=""
            padded={false}
            aria-busy={busy || undefined}
            className={cn(
              'hn-anim-pop z-(--hn-z-overlay) flex w-max max-w-xs min-w-56 flex-col gap-2.5 p-3 shadow-md outline-none',
              className,
            )}
          >
            <div className="flex flex-col gap-0.5">
              <Text id={titleId} weight="medium">
                {title}
              </Text>
              {description && (
                <Text id={descriptionId} tone="muted" size="sm">
                  {description}
                </Text>
              )}
            </div>
            {content}
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="soft" tone="neutral" disabled={busy} onClick={cancel}>
                {cancelText ?? t.common.cancel}
              </Button>
              <Button size="sm" tone={tone} loading={busy} onClick={confirm}>
                {confirmText ?? t.common.confirm}
              </Button>
            </div>
          </Card>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  )
}
