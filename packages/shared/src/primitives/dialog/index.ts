import { hideOthers } from 'aria-hidden'

export function dialogWarnings({
  titleName = 'DialogTitle',
  contentName = 'DialogContent',
  componentLink = 'dialog.html#title',
}: {
  titleName?: string
  contentName?: string
  componentLink?: string
} = {}) {
  return {
    title: `Warning: \`${contentName}\` requires a \`${titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://www.reka-ui.com/docs/components/${componentLink}`,
    description: `Warning: Missing \`Description\` or \`aria-describedby="undefined"\` for ${contentName}.`,
  }
}

export function warnDialogAccessibility(
  messages: { title: string; description: string },
  titleId: string,
  descriptionId: string,
  contentElement: Element | null | undefined,
) {
  if (!document.getElementById(titleId)) console.warn(messages.title)
  const describedById = contentElement?.getAttribute('aria-describedby')
  if (descriptionId && describedById && !document.getElementById(descriptionId))
    console.warn(messages.description)
}

export function isContextPointerDown(event: { button: number; ctrlKey: boolean }) {
  return event.button === 2 || (event.button === 0 && event.ctrlKey === true)
}

export function hideOutside(element: Element) {
  let insideClosedPopover = false
  try {
    insideClosedPopover = !!element.closest('[popover]:not(:popover-open)')
  } catch {}
  return insideClosedPopover ? undefined : hideOthers(element)
}

interface OutsideEvent {
  defaultPrevented: boolean
  target: EventTarget | null
  detail: { originalEvent: Event }
  preventDefault: () => void
}

export function createNonModalOutsideTracker() {
  let interacted = false
  let pointerDown = false
  return {
    get interacted() {
      return interacted
    },
    interact(event: OutsideEvent, trigger: Element | null | undefined) {
      if (!event.defaultPrevented) {
        interacted = true
        if (event.detail.originalEvent.type === 'pointerdown') pointerDown = true
      }
      if (trigger?.contains(event.target as Node)) event.preventDefault()
      if (event.detail.originalEvent.type === 'focusin' && pointerDown) event.preventDefault()
    },
    reset() {
      interacted = false
      pointerDown = false
    },
  }
}
