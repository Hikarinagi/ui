export function ratingItems(length: number) {
  return Array.from({ length }, (_, index) => index + 1)
}

export function ratingSteps(item: number, stepSize: number) {
  const start = item - 1
  const count = Math.ceil((item - start) / stepSize)
  return Array.from({ length: count }, (_, index) =>
    Number((start + (index + 1) * stepSize).toFixed(2)),
  )
}

export function nextRating(clearable: boolean, current: number | undefined, rating: number) {
  return clearable && current === rating ? 0 : rating
}

export function isRatingStepActive(step: number, hovered: number, value: number | undefined) {
  return (hovered > 0 && step <= hovered) || (hovered === 0 && step <= (value ?? Number.NaN))
}

export function isRatingStepVisible(
  focused: boolean,
  stepSize: number,
  step: number,
  hovered: number,
  value: number | undefined,
) {
  return focused || stepSize === 1 || step % 1 === 0 || step === hovered || step === value
}

export function ratingStepWidth(step: number) {
  return `${(step % 1 || 1) * 100}%`
}

export function ratingStepZIndex(steps: number[], step: number) {
  return steps.length - steps.indexOf(step)
}
