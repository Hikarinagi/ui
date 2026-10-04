'use client'

import { DialogContent, type DialogContentProps } from '../../primitives/dialog'
import { AlertDialogContent } from '../../primitives/dialog/alert-dialog'
import { useDialogCloseFocus } from '../../lib/dialog-focus'

export interface ModalContentProps extends DialogContentProps {
  alert?: boolean
}

export function ModalContent({ alert, onCloseAutoFocus, ...props }: ModalContentProps) {
  const closeAutoFocus = useDialogCloseFocus(event => onCloseAutoFocus?.(event))
  const Content = alert ? AlertDialogContent : DialogContent
  return <Content {...props} onCloseAutoFocus={closeAutoFocus} />
}
