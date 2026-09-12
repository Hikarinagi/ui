import { injectDialogRootContext } from 'reka-ui'

export function useDialogCloseFocus(onCloseAutoFocus: (event: Event) => void) {
  const context = injectDialogRootContext()

  return (event: Event) => {
    onCloseAutoFocus(event)
    if (event.defaultPrevented) return
    event.preventDefault()
    const target = context.triggerElement.value
    if (target?.isConnected) target.focus({ preventScroll: true })
  }
}
