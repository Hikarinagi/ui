'use client'

import { useDialogRootContext } from '../primitives/dialog'

export function useDialogCloseFocus(onCloseAutoFocus: (event: Event) => void) {
  const context = useDialogRootContext()

  return (event: Event) => {
    onCloseAutoFocus(event)
    if (event.defaultPrevented) return
    event.preventDefault()
    const target = context.triggerElement.current
    if (target?.isConnected) target.focus({ preventScroll: true })
  }
}
