import { nextTick } from 'vue'
import { injectPopoverRootContext } from 'reka-ui'

export function usePopoverCloseFocus(emit: (event: 'closeAutoFocus', value: Event) => void) {
  const root = injectPopoverRootContext()

  return (event: Event) => {
    emit('closeAutoFocus', event)
    if (!event.defaultPrevented || !root.triggerElement.value) return

    const trigger = root.triggerElement.value
    root.triggerElement.value = undefined
    nextTick(() => {
      root.triggerElement.value ??= trigger
    })
  }
}
