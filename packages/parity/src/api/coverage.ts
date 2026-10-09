export interface Undeclared {
  props?: string[]
  events?: string[]
  slots?: string[]
  reason: string
}

export const UNDECLARED: Record<string, Undeclared> = {
  NavigationMenuContent: {
    events: ['dismiss'],
    reason:
      "Reka's DismissableLayer emits dismiss; the listener reaches it through attribute fallthrough and the Vue documentation lists the event",
  },
}

export const EXCEPTIONS: Record<string, string> = {
  'ScrollTop: missing callback onClick (emit click): only the DOM attribute exists':
    "Vue re-emits the native click MouseEvent, which is the event React's onClick already receives",
  'ImageGroup: missing prop className':
    'Renders no element of its own: the template is the default slot plus a Lightbox, a multi-root fragment, so Vue drops the class as well',
  'TooltipProvider: missing prop className':
    'Renders no element: the Reka provider only renders its slot, so Vue drops the class as well',
  'Tooltip: content children (slot default): does not accept a ReactNode':
    "The default slot is the trigger, rendered through Reka's asChild trigger, which lends its props to one element; React types it as that element",
}

export const REACT_ONLY: Record<string, string> = {
  'Form.form':
    'Accepts the controller returned by useFormHandle, which gives React the reactive form state that Vue reads from the template ref',
}
