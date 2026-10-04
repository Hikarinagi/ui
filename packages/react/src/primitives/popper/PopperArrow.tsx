'use client'

import type { ElementType, ReactNode, Ref, SVGAttributes } from 'react'
import { Primitive } from '../../lib/primitive'
import { usePopperContentContext } from './PopperContent'
import type { Side } from './utils'

const OPPOSITE_SIDE: Record<Side, Side> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
}

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
      {children ??
        (rounded ? (
          <path d="M0 0L4.58579 4.58579C5.36683 5.36683 6.63316 5.36684 7.41421 4.58579L12 0" />
        ) : (
          <path d="M0 0L6 6L12 0" />
        ))}
    </Primitive>
  )
}

export interface PopperArrowProps extends ArrowProps {}

export function PopperArrow({ style, ...props }: PopperArrowProps) {
  const contentContext = usePopperContentContext('PopperArrow')
  const baseSide = OPPOSITE_SIDE[contentContext.placedSide]

  return (
    <span
      ref={contentContext.onArrowChange}
      style={{
        position: 'absolute',
        left: contentContext.arrowX ? `${contentContext.arrowX}px` : undefined,
        top: contentContext.arrowY ? `${contentContext.arrowY}px` : undefined,
        [baseSide]: 0,
        transformOrigin: {
          top: '',
          right: '0 0',
          bottom: 'center 0',
          left: '100% 0',
        }[contentContext.placedSide],
        transform: {
          top: 'translateY(100%)',
          right: 'translateY(50%) rotate(90deg) translateX(-50%)',
          bottom: 'rotate(180deg)',
          left: 'translateY(50%) rotate(-90deg) translateX(50%)',
        }[contentContext.placedSide],
        visibility: contentContext.shouldHideArrow ? 'hidden' : undefined,
      }}
    >
      <Arrow {...props} style={{ ...style, display: 'block' }} />
    </span>
  )
}
