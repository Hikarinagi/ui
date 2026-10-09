export type StepperState = 'completed' | 'active' | 'inactive'

export const STEPPER_KEYS = ['Enter', ' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']

export const STEPPER_STATUS_STYLE = {
  transform: 'translateX(-100%)',
  position: 'absolute',
  pointerEvents: 'none',
  opacity: 0,
  margin: 0,
} as const

export function stepperStatusText(step: number | undefined, total: number) {
  return ` Step ${step ?? ''} of ${total}`
}

export function stepperItemState(completed: boolean, current: number, step: number): StepperState {
  if (completed) return 'completed'
  if (current === step) return 'active'
  if (current > step) return 'completed'
  return 'inactive'
}

export function isStepFocusable(disabled: boolean, linear: boolean, step: number, current: number) {
  if (disabled) return false
  if (linear) return step <= current || step === current + 1
  return true
}

export function canGoToStep(
  step: number,
  items: HTMLElement[],
  linear: boolean,
  current: number | undefined,
) {
  if (step > items.length) return false
  if (step < 1) return false
  if (items.length && !!items[step] && !!items[step].getAttribute('disabled')) return false
  if (linear && step > (current ?? 1) + 1) return false
  return true
}

export function adjacentStepperItems(items: HTMLElement[], current: number) {
  return {
    next: items.length && current < items.length ? items[current] : null,
    prev: items.length && current > 1 ? items[current - 2] : null,
  }
}

export function activatesStepOnPointer(
  event: { ctrlKey: boolean },
  linear: boolean,
  step: number,
  current: number,
) {
  if (event.ctrlKey !== false) return false
  return !linear || step <= current || step === current + 1
}
