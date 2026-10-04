'use client'

import { usePopoverRootContext } from '../../../primitives/popover'

export function usePopoverCloseFocus(onCloseAutoFocus?: (event: Event) => void) {
  const root = usePopoverRootContext()

  return (event: Event) => {
    onCloseAutoFocus?.(event)
    if (!event.defaultPrevented || !root.triggerElement.current) return

    const trigger = root.triggerElement.current
    root.triggerElement.current = null
    void Promise.resolve().then(() => {
      root.triggerElement.current ??= trigger
    })
  }
}
