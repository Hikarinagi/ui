'use client'

import type { ReactNode } from 'react'
import { useControllableState } from 'radix-ui/internal'
import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../primitives/dialog/alert-dialog'
import { useOverlayPortal } from '../../lib/overlay-portal'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { useUiLocale } from '../../locale'
import { ModalContent } from '../dialog/ModalContent'
import { Button } from '../button/Button'
import { Card } from '../card/Card'
import { dialogCard, dialogWrapper } from '../dialog/dialog.variants'
import { Heading } from '../heading/Heading'
import { Text } from '../text/Text'
import { useAlertDialogConfirm } from './hooks/useAlertDialogConfirm'
import { useConfirmDelay } from './hooks/useConfirmDelay'
import {
  alertDialogActions,
  alertDialogContent,
  alertDialogCountdown,
  alertDialogHeader,
} from './alert-dialog.variants'

export interface AlertDialogProps {
  title: string
  description?: string
  confirmText?: string
  confirmDelay?: number
  cancelText?: string
  tone?: 'accent' | 'danger'
  size?: 'sm' | 'md'
  placement?: 'center' | 'bottom'
  onConfirm?: () => unknown
  onCancel?: () => void
  onError?: (error: unknown) => void
  className?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: ReactNode
  content?: ReactNode
}

export function AlertDialog({
  title,
  description,
  confirmText,
  confirmDelay = 0,
  cancelText,
  tone = 'accent',
  size = 'sm',
  placement,
  onConfirm,
  onCancel,
  onError,
  className,
  open: openProp,
  defaultOpen,
  onOpenChange,
  children,
  content,
}: AlertDialogProps) {
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: 'AlertDialog',
  })
  const { contentRef, present } = useOverlayPortal(open)
  const t = useUiLocale()
  const remaining = useConfirmDelay(open, confirmDelay)
  const { busy, guard, confirm } = useAlertDialogConfirm(
    { onConfirm },
    open,
    setOpen,
    error => onError?.(error),
    () => remaining > 0,
  )

  return (
    <AlertDialogRoot open={open} onOpenChange={setOpen}>
      {hasContent(children) && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
      {present && (
        <AlertDialogPortal>
          <AlertDialogOverlay className="hn-scrim" />
          <div className={dialogWrapper({ placement: placement ?? 'auto' })}>
            <ModalContent alert asChild onEscapeKeyDown={guard}>
              <Card
                ref={contentRef}
                padded={false}
                data-hn-alert-dialog=""
                aria-busy={busy || undefined}
                className={cn(dialogCard({ placement: placement ?? 'auto', size }), className)}
              >
                <div className={alertDialogHeader()}>
                  <AlertDialogTitle asChild>
                    <Heading level={2} size="lg">
                      {title}
                    </Heading>
                  </AlertDialogTitle>
                  {description && (
                    <AlertDialogDescription asChild>
                      <Text tone="muted">{description}</Text>
                    </AlertDialogDescription>
                  )}
                </div>
                {hasContent(content) && <div className={alertDialogContent()}>{content}</div>}
                <div className={alertDialogActions()}>
                  <AlertDialogCancel asChild>
                    <Button
                      variant="soft"
                      tone="neutral"
                      disabled={busy}
                      onClick={() => onCancel?.()}
                    >
                      {cancelText ?? t.common.cancel}
                    </Button>
                  </AlertDialogCancel>
                  <Button tone={tone} loading={busy} disabled={remaining > 0} onClick={confirm}>
                    {confirmText ?? t.common.confirm}
                    {remaining > 0 && <span className={alertDialogCountdown()}>({remaining})</span>}
                  </Button>
                </div>
              </Card>
            </ModalContent>
          </div>
        </AlertDialogPortal>
      )}
    </AlertDialogRoot>
  )
}
