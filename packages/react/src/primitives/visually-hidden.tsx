import type { CSSProperties, HTMLAttributes, Ref } from 'react'
import {
  isAriaHidden,
  isFullyHidden,
  VISUALLY_HIDDEN_STYLE,
  type VisuallyHiddenFeature,
} from '../../../shared/src/primitives/visually-hidden'
import { Primitive, type PrimitiveProps } from '../lib/primitive'

export interface PrimitiveVisuallyHiddenProps extends PrimitiveProps, HTMLAttributes<HTMLElement> {
  feature?: VisuallyHiddenFeature
  ref?: Ref<HTMLElement>
}

export function PrimitiveVisuallyHidden({
  feature = 'focusable',
  as = 'span',
  style,
  ...props
}: PrimitiveVisuallyHiddenProps) {
  return (
    <Primitive
      as={as}
      aria-hidden={isAriaHidden(feature) ? 'true' : undefined}
      data-hidden={isFullyHidden(feature) ? '' : undefined}
      tabIndex={isFullyHidden(feature) ? -1 : undefined}
      {...props}
      style={{ ...(VISUALLY_HIDDEN_STYLE as CSSProperties), ...style }}
    />
  )
}
