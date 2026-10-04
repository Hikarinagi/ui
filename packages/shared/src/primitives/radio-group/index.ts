import { handleAndDispatchCustomEvent } from '../dismissable-layer'

export const RADIO_SELECT = 'radio.select'

const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']

export interface RadioSelectDetail<T = unknown, E extends Event = Event> {
  originalEvent: E
  value: T
}

export type RadioSelectEvent<T = unknown, E extends Event = Event> = CustomEvent<
  RadioSelectDetail<T, E>
>

export function dispatchRadioSelect<T, E extends Event>(
  event: E,
  value: T,
  callback: (event: RadioSelectEvent<T, E>) => void,
) {
  handleAndDispatchCustomEvent<RadioSelectEvent<T, E>>(RADIO_SELECT, callback, {
    originalEvent: event,
    value,
  })
}

export function trackArrowKeys(target: Window) {
  let pressed = false
  const down = (event: KeyboardEvent) => {
    if (ARROW_KEYS.includes(event.key)) pressed = true
  }
  const up = () => {
    pressed = false
  }
  target.addEventListener('keydown', down)
  target.addEventListener('keyup', up)
  return {
    get pressed() {
      return pressed
    },
    dispose() {
      target.removeEventListener('keydown', down)
      target.removeEventListener('keyup', up)
    },
  }
}
