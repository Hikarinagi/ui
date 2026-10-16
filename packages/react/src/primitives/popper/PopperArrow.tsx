'use client'

import type { CSSProperties, ElementType, ReactNode, Ref, SVGAttributes } from 'react'
import {
  ARROW_PATH,
  popperArrowStyle,
  ROUNDED_ARROW_PATH,
} from '../../../../shared/src/primitives/popper'
import { Primitive } from '../../lib/primitive'
import { usePopperContentContext } from './PopperContent'

export interface ArrowProps extends Omit<SVGAttributes<SVGElement>, 'width' | 'height'> {
  width?: number
  height?: number
  rounded?: boolean
  as?: ElementType
  asChild?: boolean
  children?: ReactNode
  ref?: Ref<SVGElement>
}

export function Arrow({
  width = 10,
  height = 5,
  rounded = false,
  as = 'svg',
  asChild,
  children,
  ...attrs
}: ArrowProps) {
  return (
    <Primitive
      as={as}
      asChild={asChild}
      {...({
        width,
        height,
        rounded: String(rounded),
        viewBox: asChild ? undefined : '0 0 12 6',
        preserveAspectRatio: asChild ? undefined : 'none',
        ...attrs,
      } as object)}
    >
      {children ?? (rounded ? <path d={ROUNDED_ARROW_PATH} /> : <path d={ARROW_PATH} />)}
    </Primitive>
  )
}

export interface PopperArrowProps extends ArrowProps {}

export function PopperArrow({ style, ...props }: PopperArrowProps) {
  const contentContext = usePopperContentContext('PopperArrow')

  return (
    <span
      ref={contentContext.onArrowChange}
      style={
        popperArrowStyle(
          contentContext.placedSide,
          contentContext.arrowX,
          contentContext.arrowY,
          contentContext.shouldHideArrow,
        ) as CSSProperties
      }
    >
      <Arrow {...props} style={{ ...style, display: 'block' }} />
    </span>
  )
}
