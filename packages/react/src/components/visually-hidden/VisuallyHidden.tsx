import type { CSSProperties } from 'react'
import { VISUALLY_HIDDEN_STYLE } from '../../../../shared/src/primitives/visually-hidden'
import { Primitive, type PrimitiveElementProps } from '../../lib/primitive'

export type VisuallyHiddenProps = PrimitiveElementProps

export function VisuallyHidden({ as = 'span', style, ...props }: VisuallyHiddenProps) {
  return (
    <Primitive
      as={as}
      {...props}
      style={{ ...(VISUALLY_HIDDEN_STYLE as CSSProperties), ...style }}
    />
  )
}
