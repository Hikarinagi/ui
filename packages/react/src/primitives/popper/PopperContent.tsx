'use client'

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type Ref,
  type RefObject,
} from 'react'
import {
  arrow as floatingUIarrow,
  autoUpdate,
  flip,
  hide,
  limitShift,
  offset,
  shift,
  size,
  useFloating,
  type Middleware,
  type Placement,
  type ReferenceElement,
} from '@floating-ui/react-dom'
import { useCallbackRef, useComposedRefs } from 'radix-ui/internal'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { usePopperDirection } from './direction'
import { usePopperRootContext } from './PopperRoot'
import {
  getSideAndAlignFromPlacement,
  isNotNull,
  transformOrigin,
  type Align,
  type Direction,
  type Side,
} from './utils'

export interface PopperContentProps extends PrimitiveProps, HTMLAttributes<HTMLElement> {
  memoDependencies?: unknown[]
  side?: Side
  sideOffset?: number
  sideFlip?: boolean
  align?: Align
  alignOffset?: number
  alignFlip?: boolean
  avoidCollisions?: boolean
  collisionBoundary?: Element | null | Array<Element | null>
  collisionPadding?: number | Partial<Record<Side, number>>
  arrowPadding?: number
  hideShiftedArrow?: boolean
  sticky?: 'partial' | 'always'
  hideWhenDetached?: boolean
  positionStrategy?: 'absolute' | 'fixed'
  updatePositionStrategy?: 'optimized' | 'always'
  disableUpdateOnLayoutShift?: boolean
  prioritizePosition?: boolean
  reference?: ReferenceElement
  dir?: Direction | (string & {})
  onPlaced?: () => void
  ref?: Ref<HTMLDivElement>
  [attribute: `data-${string}`]: string | undefined
}

interface PopperContentContextValue {
  placedSide: Side
  onArrowChange: (arrow: HTMLElement | null) => void
  arrowX: number
  arrowY: number
  shouldHideArrow: boolean
}

const PopperContentContext = createContext<PopperContentContextValue | null>(null)

export function usePopperContentContext(consumer: string) {
  const context = useContext(PopperContentContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`PopperContent\``)
  return context
}

type Size = { width: number; height: number }

function useSize(element: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState<Size | undefined>(undefined)

  useLayoutEffect(() => {
    const el = element.current
    if (!el) {
      setSize(undefined)
      return
    }
    const apply = (width: number, height: number) =>
      setSize(current =>
        current && current.width === width && current.height === height
          ? current
          : { width, height },
      )
    apply(el.offsetWidth, el.offsetHeight)

    const resizeObserver = new ResizeObserver(entries => {
      if (!Array.isArray(entries)) return
      if (!entries.length) return
      const entry = entries[0]
      let width: number
      let height: number
      if ('borderBoxSize' in entry) {
        const borderSizeEntry = entry.borderBoxSize
        const borderSize = (
          Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry
        ) as ResizeObserverSize
        width = borderSize.inlineSize
        height = borderSize.blockSize
      } else {
        width = el.offsetWidth
        height = el.offsetHeight
      }
      apply(width, height)
    })
    resizeObserver.observe(el, { box: 'border-box' })
    return () => resizeObserver.disconnect()
  }, [element])

  return { width: size?.width ?? 0, height: size?.height ?? 0 }
}

export function PopperContent({
  memoDependencies,
  side = 'bottom',
  sideOffset = 0,
  sideFlip = true,
  align = 'center',
  alignOffset = 0,
  alignFlip = true,
  avoidCollisions = true,
  collisionBoundary = [],
  collisionPadding: collisionPaddingProp = 0,
  arrowPadding = 0,
  hideShiftedArrow = true,
  sticky = 'partial',
  hideWhenDetached = false,
  positionStrategy = 'fixed',
  updatePositionStrategy = 'optimized',
  disableUpdateOnLayoutShift = false,
  prioritizePosition = false,
  reference: referenceProp,
  dir: dirProp,
  onPlaced,
  as,
  asChild,
  style,
  children,
  ref,
  ...attrs
}: PopperContentProps) {
  const rootContext = usePopperRootContext('PopperContent')
  const [contentElement, setContentElement] = useState<HTMLElement | null>(null)
  const composedRef = useComposedRefs<HTMLElement>(ref as Ref<HTMLElement>, setContentElement)
  const dir = usePopperDirection(dirProp)

  const arrowRef = useRef<HTMLElement | null>(null)
  const [arrow, setArrow] = useState<HTMLElement | null>(null)
  const onArrowChange = useCallback((element: HTMLElement | null) => {
    arrowRef.current = element
    setArrow(element)
  }, [])
  const { width: arrowWidth, height: arrowHeight } = useSize(arrowRef)
  const [strategy] = useState(positionStrategy)

  const desiredPlacement = (side + (align !== 'center' ? `-${align}` : '')) as Placement

  const collisionPadding =
    typeof collisionPaddingProp === 'number'
      ? collisionPaddingProp
      : { top: 0, right: 0, bottom: 0, left: 0, ...collisionPaddingProp }

  const boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [collisionBoundary]

  const detectOverflowOptions = {
    padding: collisionPadding,
    boundary: boundary.filter(isNotNull),
    altBoundary: boundary.length > 0,
  }

  const flipOptions = {
    mainAxis: sideFlip,
    crossAxis: alignFlip,
  }

  const middleware = [
    offset({
      mainAxis: sideOffset + arrowHeight,
      alignmentAxis: alignOffset,
    }),
    prioritizePosition &&
      avoidCollisions &&
      flip({
        ...detectOverflowOptions,
        ...flipOptions,
      }),
    avoidCollisions &&
      shift({
        mainAxis: true,
        crossAxis: !!prioritizePosition,
        limiter: sticky === 'partial' ? limitShift() : undefined,
        ...detectOverflowOptions,
      }),
    !prioritizePosition &&
      avoidCollisions &&
      flip({
        ...detectOverflowOptions,
        ...flipOptions,
      }),
    size({
      ...detectOverflowOptions,
      apply: ({ elements, rects, availableWidth, availableHeight }) => {
        const { width: anchorWidth, height: anchorHeight } = rects.reference
        const contentStyle = elements.floating.style
        contentStyle.setProperty('--radix-popper-available-width', `${availableWidth}px`)
        contentStyle.setProperty('--radix-popper-available-height', `${availableHeight}px`)
        contentStyle.setProperty('--radix-popper-anchor-width', `${anchorWidth}px`)
        contentStyle.setProperty('--radix-popper-anchor-height', `${anchorHeight}px`)
      },
    }),
    arrow && floatingUIarrow({ element: arrow, padding: arrowPadding }),
    transformOrigin({
      arrowWidth,
      arrowHeight,
      dir,
    }),
    hideWhenDetached && hide({ strategy: 'referenceHidden', ...detectOverflowOptions }),
  ] as Middleware[]

  const reference = referenceProp ?? rootContext.anchor

  const { refs, floatingStyles, placement, isPositioned, middlewareData } = useFloating({
    strategy,
    placement: desiredPlacement,
    whileElementsMounted: (...args) =>
      autoUpdate(...args, {
        layoutShift: !disableUpdateOnLayoutShift,
        animationFrame: updatePositionStrategy === 'always',
      }),
    elements: { reference: reference ?? null },
    middleware,
  })

  const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement)

  const handlePlaced = useCallbackRef(onPlaced)
  useLayoutEffect(() => {
    if (isPositioned) handlePlaced()
  }, [isPositioned, handlePlaced])

  const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0
  const shouldHideArrow = hideShiftedArrow && cannotCenterArrow

  const [contentZIndex, setContentZIndex] = useState('')
  useLayoutEffect(() => {
    if (contentElement) setContentZIndex(window.getComputedStyle(contentElement).zIndex)
  }, [contentElement])

  const arrowX = middlewareData.arrow?.x ?? 0
  const arrowY = middlewareData.arrow?.y ?? 0

  const contentContext = useMemo<PopperContentContextValue>(
    () => ({ placedSide, onArrowChange, arrowX, arrowY, shouldHideArrow }),
    [placedSide, onArrowChange, arrowX, arrowY, shouldHideArrow],
  )

  return (
    <div
      ref={refs.setFloating}
      data-radix-popper-content-wrapper=""
      dir={dir}
      style={
        {
          ...floatingStyles,
          transform: isPositioned ? floatingStyles.transform : 'translate(0, -200%)',
          minWidth: 'max-content',
          zIndex: contentZIndex,
          '--radix-popper-transform-origin': [
            middlewareData.transformOrigin?.x,
            middlewareData.transformOrigin?.y,
          ].join(' '),
          ...(middlewareData.hide?.referenceHidden && {
            visibility: 'hidden',
            pointerEvents: 'none',
          }),
        } as CSSProperties
      }
    >
      <PopperContentContext value={contentContext}>
        <Primitive
          {...attrs}
          ref={composedRef}
          as={as}
          asChild={asChild}
          data-side={placedSide}
          data-align={placedAlign}
          {...(memoDependencies ? {} : { dir })}
          style={{ ...style, animation: !isPositioned ? 'none' : undefined }}
        >
          {children}
        </Primitive>
      </PopperContentContext>
    </div>
  )
}
