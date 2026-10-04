export type ToggleState = 'on' | 'off'

export function toggleState(pressed: unknown): ToggleState {
  return pressed ? 'on' : 'off'
}
