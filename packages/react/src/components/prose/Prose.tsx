import { cn } from '../../lib/cn'
import { Primitive, type PrimitiveElementProps } from '../../lib/primitive'

export type ProseProps = PrimitiveElementProps

export function Prose({ as = 'div', asChild, className, ...attrs }: ProseProps) {
  return <Primitive as={as} asChild={asChild} {...attrs} className={cn('hn-prose', className)} />
}
