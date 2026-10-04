export function clamp(
  value: number,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
) {
  return Math.min(max, Math.max(min, value))
}

export function getNextSortedValues(prevValues: number[] = [], nextValue: number, atIndex: number) {
  const nextValues = [...prevValues]
  nextValues[atIndex] = nextValue
  return nextValues.sort((a, b) => a - b)
}

export function convertValueToPercentage(value: number, min: number, max: number) {
  const maxSteps = max - min
  const percentPerStep = 100 / maxSteps
  const percentage = percentPerStep * (value - min)
  return clamp(percentage, 0, 100)
}

export function getLabel(index: number, totalValues: number) {
  if (totalValues > 2) return `Value ${index + 1} of ${totalValues}`
  if (totalValues === 2) return ['Minimum', 'Maximum'][index]
  return undefined
}

export function getClosestValueIndex(values: number[], nextValue: number) {
  if (values.length === 1) return 0
  const distances = values.map(value => Math.abs(value - nextValue))
  const closestDistance = Math.min(...distances)
  return distances.indexOf(closestDistance)
}

export function linearScale(input: readonly [number, number], output: readonly [number, number]) {
  return (value: number) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0]
    const ratio = (output[1] - output[0]) / (input[1] - input[0])
    return output[0] + ratio * (value - input[0])
  }
}

export function getThumbInBoundsOffset(width: number, left: number, direction: number) {
  const halfWidth = width / 2
  const halfPercent = 50
  const offset = linearScale([0, halfPercent], [0, halfWidth])
  return (halfWidth - offset(left) * direction) * direction
}

function getStepsBetweenValues(values: number[]) {
  return values.slice(0, -1).map((value, index) => values[index + 1]! - value)
}

export function hasMinStepsBetweenValues(values: number[], minStepsBetweenValues: number) {
  if (minStepsBetweenValues > 0) {
    const stepsBetweenValues = getStepsBetweenValues(values)
    const actualMinStepsBetweenValues = Math.min(...stepsBetweenValues)
    return actualMinStepsBetweenValues >= minStepsBetweenValues
  }
  return true
}

export function getDecimalCount(value: number) {
  return (String(value).split('.')[1] || '').length
}

export function roundValue(value: number, decimalCount: number) {
  const rounder = 10 ** decimalCount
  return Math.round(value * rounder) / rounder
}

export const PAGE_KEYS = ['PageUp', 'PageDown']
export const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
export const BACK_KEYS: Record<string, string[]> = {
  'from-left': ['Home', 'PageDown', 'ArrowDown', 'ArrowLeft'],
  'from-right': ['Home', 'PageDown', 'ArrowDown', 'ArrowRight'],
  'from-bottom': ['Home', 'PageDown', 'ArrowDown', 'ArrowLeft'],
  'from-top': ['Home', 'PageUp', 'ArrowUp', 'ArrowLeft'],
}

export function resolveSliderUpdate(
  values: number[],
  value: number,
  atIndex: number,
  options: { min: number; max: number; step: number; minStepsBetweenThumbs: number },
) {
  const { min, max, step, minStepsBetweenThumbs } = options
  const snapped = roundValue(Math.round((value - min) / step) * step + min, getDecimalCount(step))
  const nextValue = clamp(snapped, min, max)
  const nextValues = getNextSortedValues(values, nextValue, atIndex)
  if (!hasMinStepsBetweenValues(nextValues, minStepsBetweenThumbs * step)) return undefined
  return { values: nextValues, index: nextValues.indexOf(nextValue) }
}

export function sliderStepAmount(event: { key: string; shiftKey: boolean }, step: number) {
  const skip = PAGE_KEYS.includes(event.key) || (event.shiftKey && ARROW_KEYS.includes(event.key))
  return step * (skip ? 10 : 1)
}

export type SliderOrientation = 'horizontal' | 'vertical'
export type SliderThumbAlignment = 'contain' | 'overflow'

export function sliderOrientationState(
  orientation: SliderOrientation,
  dir: 'ltr' | 'rtl' | undefined,
  inverted: boolean,
  alignment: SliderThumbAlignment,
) {
  if (orientation === 'horizontal') {
    const fromLeft = (dir !== 'rtl' && !inverted) || (dir !== 'ltr' && inverted)
    return {
      startEdge: fromLeft ? 'left' : 'right',
      endEdge: fromLeft ? 'right' : 'left',
      direction: fromLeft ? 1 : -1,
      size: 'width',
      increasing: fromLeft,
      slideDirection: fromLeft ? 'from-left' : 'from-right',
      thumbTransform:
        !fromLeft && alignment === 'overflow' ? 'translateX(50%)' : 'translateX(-50%)',
    } as const
  }
  const fromBottom = !inverted
  return {
    startEdge: fromBottom ? 'bottom' : 'top',
    endEdge: fromBottom ? 'top' : 'bottom',
    direction: fromBottom ? 1 : -1,
    size: 'height',
    increasing: !fromBottom,
    slideDirection: fromBottom ? 'from-bottom' : 'from-top',
    thumbTransform:
      !fromBottom && alignment === 'overflow' ? 'translateY(-50%)' : 'translateY(50%)',
  } as const
}

export function sliderStepDirection(slideDirection: string, key: string) {
  return BACK_KEYS[slideDirection]!.includes(key) ? -1 : 1
}

export function createSlideGeometry(axis: 'x' | 'y') {
  let offset: number | undefined
  let rect: DOMRect | undefined
  return {
    value(
      event: { clientX: number; clientY: number },
      slideStart: boolean,
      options: {
        element: HTMLElement
        thumb: HTMLElement
        contain: boolean
        output: [number, number]
      },
    ) {
      const { element, thumb, contain, output } = options
      const bounds = rect || element.getBoundingClientRect()
      const thumbSize = contain ? (axis === 'x' ? thumb.clientWidth : thumb.clientHeight) : 0
      const client = axis === 'x' ? event.clientX : event.clientY
      if (!offset && !slideStart && contain) {
        const thumbRect = thumb.getBoundingClientRect()
        offset = client - (axis === 'x' ? thumbRect.left : thumbRect.top)
      }
      const start = axis === 'x' ? bounds.left : bounds.top
      const length = axis === 'x' ? bounds.width : bounds.height
      const scale = linearScale([0, length - thumbSize], output)
      rect = bounds
      const position = slideStart ? client - start - thumbSize / 2 : client - start - (offset ?? 0)
      return scale(position)
    },
    reset() {
      rect = undefined
      offset = undefined
    },
  }
}

export function sliderThumbOffset(
  alignment: SliderThumbAlignment,
  size: number,
  percent: number,
  direction: number,
) {
  if (alignment === 'overflow' || !size) return 0
  return getThumbInBoundsOffset(size, percent, direction)
}
