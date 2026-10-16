import {
  arrow,
  flip,
  hide,
  limitShift,
  offset,
  shift,
  size,
  type Boundary,
  type Middleware,
  type MiddlewareData,
  type Padding,
  type Placement,
} from '@floating-ui/dom'

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const
const ALIGN_OPTIONS = ['start', 'center', 'end'] as const

export type Side = (typeof SIDE_OPTIONS)[number]
export type Align = (typeof ALIGN_OPTIONS)[number]
export type Direction = 'ltr' | 'rtl'

export function isNotNull<T>(value: T | null): value is T {
  return value !== null
}

export function transformOrigin(options: {
  arrowWidth: number
  arrowHeight: number
  dir?: Direction
}): Middleware {
  return {
    name: 'transformOrigin',
    options,
    fn(data) {
      const { placement, rects, middlewareData } = data

      const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0
      const isArrowHidden = cannotCenterArrow
      const arrowWidth = isArrowHidden ? 0 : options.arrowWidth
      const arrowHeight = isArrowHidden ? 0 : options.arrowHeight

      const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement)
      const noArrowAlignX = {
        start: options.dir === 'rtl' ? '100%' : '0%',
        center: '50%',
        end: options.dir === 'rtl' ? '0%' : '100%',
      }[placedAlign]

      const noArrowAlignY = {
        start: '0%',
        center: '50%',
        end: '100%',
      }[placedAlign]

      const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2
      const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2

      let x = ''
      let y = ''

      if (placedSide === 'bottom') {
        x = isArrowHidden ? noArrowAlignX : `${arrowXCenter}px`
        y = `${-arrowHeight}px`
      } else if (placedSide === 'top') {
        x = isArrowHidden ? noArrowAlignX : `${arrowXCenter}px`
        y = `${rects.floating.height + arrowHeight}px`
      } else if (placedSide === 'right') {
        x = `${-arrowHeight}px`
        y = isArrowHidden ? noArrowAlignY : `${arrowYCenter}px`
      } else if (placedSide === 'left') {
        x = `${rects.floating.width + arrowHeight}px`
        y = isArrowHidden ? noArrowAlignY : `${arrowYCenter}px`
      }
      return { data: { x, y } }
    },
  }
}

export function getSideAndAlignFromPlacement(placement: Placement) {
  const [side, align = 'center'] = placement.split('-')
  return [side as Side, align as Align] as const
}

export type PopperSticky = 'partial' | 'always'
export type PopperStrategy = 'absolute' | 'fixed'
export type PopperUpdateStrategy = 'optimized' | 'always'

export const POPPER_CONTENT_DEFAULTS = {
  side: 'bottom' as Side,
  sideOffset: 0,
  sideFlip: true,
  align: 'center' as Align,
  alignOffset: 0,
  alignFlip: true,
  arrowPadding: 0,
  hideShiftedArrow: true,
  avoidCollisions: true,
  collisionBoundary: () => [] as Element[],
  collisionPadding: 0,
  sticky: 'partial' as PopperSticky,
  hideWhenDetached: false,
  positionStrategy: 'fixed' as PopperStrategy,
  updatePositionStrategy: 'optimized' as PopperUpdateStrategy,
  prioritizePosition: false,
}

export function popperPlacement(side: Side, align: Align) {
  return (side + (align !== 'center' ? `-${align}` : '')) as Placement
}

export interface PopperMiddlewareOptions {
  sideOffset: number
  alignOffset: number
  sideFlip: boolean
  alignFlip: boolean
  avoidCollisions: boolean
  prioritizePosition: boolean
  sticky: PopperSticky
  collisionPadding: number | Partial<Record<Side, number>>
  collisionBoundary: Element | null | Array<Element | null>
  arrow: HTMLElement | null | undefined
  arrowWidth: number
  arrowHeight: number
  arrowPadding: number
  hideWhenDetached: boolean
  dir: Direction
  prefix: 'reka' | 'radix'
}

export function popperMiddleware(options: PopperMiddlewareOptions) {
  const padding: Padding =
    typeof options.collisionPadding === 'number'
      ? options.collisionPadding
      : { top: 0, right: 0, bottom: 0, left: 0, ...options.collisionPadding }
  const boundary = Array.isArray(options.collisionBoundary)
    ? options.collisionBoundary
    : [options.collisionBoundary]
  const detectOverflowOptions = {
    padding,
    boundary: boundary.filter(isNotNull) as Boundary,
    altBoundary: boundary.length > 0,
  }
  const flipOptions = { mainAxis: options.sideFlip, crossAxis: options.alignFlip }
  const { prefix } = options
  return [
    offset({
      mainAxis: options.sideOffset + options.arrowHeight,
      alignmentAxis: options.alignOffset,
    }),
    options.prioritizePosition &&
      options.avoidCollisions &&
      flip({ ...detectOverflowOptions, ...flipOptions }),
    options.avoidCollisions &&
      shift({
        mainAxis: true,
        crossAxis: !!options.prioritizePosition,
        limiter: options.sticky === 'partial' ? limitShift() : undefined,
        ...detectOverflowOptions,
      }),
    !options.prioritizePosition &&
      options.avoidCollisions &&
      flip({ ...detectOverflowOptions, ...flipOptions }),
    size({
      ...detectOverflowOptions,
      apply: ({ elements, rects, availableWidth, availableHeight }) => {
        const { width: anchorWidth, height: anchorHeight } = rects.reference
        const contentStyle = elements.floating.style
        contentStyle.setProperty(`--${prefix}-popper-available-width`, `${availableWidth}px`)
        contentStyle.setProperty(`--${prefix}-popper-available-height`, `${availableHeight}px`)
        contentStyle.setProperty(`--${prefix}-popper-anchor-width`, `${anchorWidth}px`)
        contentStyle.setProperty(`--${prefix}-popper-anchor-height`, `${anchorHeight}px`)
      },
    }),
    options.arrow && arrow({ element: options.arrow, padding: options.arrowPadding }),
    transformOrigin({
      arrowWidth: options.arrowWidth,
      arrowHeight: options.arrowHeight,
      dir: options.dir,
    }),
    options.hideWhenDetached && hide({ strategy: 'referenceHidden', ...detectOverflowOptions }),
  ] as Middleware[]
}

export function popperWrapperStyle(
  floatingStyles: object & { transform?: unknown },
  options: {
    isPositioned: boolean
    zIndex: string
    middlewareData: MiddlewareData
    prefix: 'reka' | 'radix'
  },
) {
  const { isPositioned, zIndex, middlewareData, prefix } = options
  return {
    ...floatingStyles,
    transform: isPositioned ? floatingStyles.transform : 'translate(0, -200%)',
    minWidth: 'max-content',
    zIndex,
    [`--${prefix}-popper-transform-origin`]: [
      middlewareData.transformOrigin?.x,
      middlewareData.transformOrigin?.y,
    ].join(' '),
    ...(middlewareData.hide?.referenceHidden && {
      visibility: 'hidden',
      pointerEvents: 'none',
    }),
  }
}

export function shouldHidePopperArrow(hideShiftedArrow: boolean, middlewareData: MiddlewareData) {
  return hideShiftedArrow && middlewareData.arrow?.centerOffset !== 0
}

export const OPPOSITE_SIDE: Record<Side, Side> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
}

export const ARROW_PATH = 'M0 0L6 6L12 0'
export const ROUNDED_ARROW_PATH =
  'M0 0L4.58579 4.58579C5.36683 5.36683 6.63316 5.36684 7.41421 4.58579L12 0'

export function popperArrowStyle(
  placedSide: Side,
  arrowX: number | undefined,
  arrowY: number | undefined,
  hidden: boolean,
) {
  return {
    position: 'absolute',
    left: arrowX ? `${arrowX}px` : undefined,
    top: arrowY ? `${arrowY}px` : undefined,
    [OPPOSITE_SIDE[placedSide]]: 0,
    transformOrigin: { top: '', right: '0 0', bottom: 'center 0', left: '100% 0' }[placedSide],
    transform: {
      top: 'translateY(100%)',
      right: 'translateY(50%) rotate(90deg) translateX(-50%)',
      bottom: 'rotate(180deg)',
      left: 'translateY(50%) rotate(-90deg) translateX(50%)',
    }[placedSide],
    visibility: hidden ? 'hidden' : undefined,
  } as const
}
