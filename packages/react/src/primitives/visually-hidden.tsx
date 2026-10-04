import type { CSSProperties, HTMLAttributes, Ref } from 'react'
import { Primitive, type PrimitiveProps } from '../lib/primitive'

const hidden: CSSProperties = {
  position: 'absolute',
  border: 0,
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  wordWrap: 'normal',
  top: '-1px',
  left: '-1px',
}

export interface PrimitiveVisuallyHiddenProps extends PrimitiveProps, HTMLAttributes<HTMLElement> {
  feature?: 'focusable' | 'fully-hidden'
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
      aria-hidden={feature === 'focusable' || feature === 'fully-hidden' ? 'true' : undefined}
      data-hidden={feature === 'fully-hidden' ? '' : undefined}
      tabIndex={feature === 'fully-hidden' ? -1 : undefined}
      {...props}
      style={{ ...hidden, ...style }}
    />
  )
}
