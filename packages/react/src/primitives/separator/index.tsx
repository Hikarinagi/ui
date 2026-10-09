import {
  separatorOrientation,
  separatorSemantics,
  type SeparatorOrientation,
} from '../../../../shared/src/primitives/separator'
import { Primitive, type PrimitiveElementProps } from '../../lib/primitive'

export interface SeparatorProps extends PrimitiveElementProps {
  orientation?: SeparatorOrientation
  decorative?: boolean
}

export function Separator({ orientation: orientationProp, decorative, ...props }: SeparatorProps) {
  const orientation = separatorOrientation(orientationProp)
  return (
    <Primitive
      data-orientation={orientation}
      {...separatorSemantics(orientation, decorative)}
      {...props}
    />
  )
}
