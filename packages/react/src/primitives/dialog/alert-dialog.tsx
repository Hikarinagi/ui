'use client'

import { createContext, useContext, useRef } from 'react'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  type DialogCloseProps,
  type DialogContentProps,
  type DialogRootProps,
} from './index'
import { useComposedRefs } from '../utils/compose-refs'
import { useLayoutEffect } from '../utils/layout-effect'

export type AlertDialogRootProps = Omit<DialogRootProps, 'modal'>

export function AlertDialogRoot(props: AlertDialogRootProps) {
  return <DialogRoot {...props} modal />
}

export const AlertDialogTrigger = DialogTrigger
export const AlertDialogPortal = DialogPortal
export const AlertDialogOverlay = DialogOverlay
export const AlertDialogTitle = DialogTitle
export const AlertDialogDescription = DialogDescription
export const AlertDialogAction = DialogClose

interface AlertDialogContentContextValue {
  onCancelElementChange: (element: HTMLElement | null) => void
}

const AlertDialogContentContext = createContext<AlertDialogContentContextValue | null>(null)

export type AlertDialogContentProps = DialogContentProps

export function AlertDialogContent({
  onPointerDownOutside,
  onInteractOutside,
  onOpenAutoFocus,
  ...props
}: AlertDialogContentProps) {
  const cancel = useRef<HTMLElement | null>(null)
  const value = useRef<AlertDialogContentContextValue>({
    onCancelElementChange: element => {
      cancel.current = element
    },
  }).current
  return (
    <AlertDialogContentContext value={value}>
      <DialogContent
        role="alertdialog"
        {...props}
        onPointerDownOutside={event => {
          onPointerDownOutside?.(event)
          event.preventDefault()
        }}
        onInteractOutside={event => {
          onInteractOutside?.(event)
          event.preventDefault()
        }}
        onOpenAutoFocus={event => {
          onOpenAutoFocus?.(event)
          queueMicrotask(() => cancel.current?.focus({ preventScroll: true }))
        }}
      />
    </AlertDialogContentContext>
  )
}

export function AlertDialogCancel({ ref, ...props }: DialogCloseProps) {
  const context = useContext(AlertDialogContentContext)
  if (!context) throw new Error('`AlertDialogCancel` must be used within `AlertDialogContent`')
  const node = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, node)
  useLayoutEffect(() => {
    context.onCancelElementChange(node.current)
  }, [])
  return <DialogClose {...props} ref={composedRef} />
}
