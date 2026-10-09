import {
  Children,
  isValidElement,
  type AnchorHTMLAttributes,
  type ElementType,
  type HTMLAttributes,
  type Ref,
} from 'react'
import { Slot } from '../primitives/utils/slot'

export interface PrimitiveProps {
  as?: ElementType
  asChild?: boolean
}

export type AnchorAttributes = Pick<
  AnchorHTMLAttributes<HTMLElement>,
  'href' | 'target' | 'rel' | 'download'
>

export type PrimitiveElementProps = PrimitiveProps &
  HTMLAttributes<HTMLElement> &
  AnchorAttributes & {
    ref?: Ref<HTMLElement>
    [attribute: `data-${string}`]: string | undefined
  }

export function Primitive({ as: Tag = 'div', asChild, children, ...props }: PrimitiveElementProps) {
  if (!asChild) return <Tag {...props}>{children}</Tag>
  const nodes = Children.toArray(children)
  const first = nodes.findIndex(node => isValidElement(node))
  if (first === -1) return <>{children}</>
  if (nodes.length === 1) return <Slot {...props}>{nodes[0]}</Slot>
  return (
    <>
      {nodes.map((node, index) =>
        index === first ? (
          <Slot key="slot" {...props}>
            {node}
          </Slot>
        ) : (
          node
        ),
      )}
    </>
  )
}
