import { Primitive, type PrimitiveElementProps } from '../../lib/primitive'

export interface SeparatorProps extends PrimitiveElementProps {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
}

export function Separator({ orientation: orientationProp, decorative, ...props }: SeparatorProps) {
  const orientation = orientationProp === 'vertical' ? 'vertical' : 'horizontal'
  return (
    <Primitive
      data-orientation={orientation}
      role={decorative ? 'none' : 'separator'}
      aria-orientation={!decorative && orientation === 'vertical' ? orientation : undefined}
      {...props}
    />
  )
}
