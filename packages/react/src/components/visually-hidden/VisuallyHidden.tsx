import { Primitive, type PrimitiveElementProps } from '../../lib/primitive'

const hidden = {
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
} as const

export type VisuallyHiddenProps = PrimitiveElementProps

export function VisuallyHidden({ as = 'span', style, ...props }: VisuallyHiddenProps) {
  return <Primitive as={as} {...props} style={{ ...hidden, ...style }} />
}
