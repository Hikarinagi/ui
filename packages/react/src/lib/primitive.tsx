import { Slot } from 'radix-ui'
import {
  Children,
  isValidElement,
  type AnchorHTMLAttributes,
  type ElementType,
  type HTMLAttributes,
  type Ref,
} from 'react'

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
  if (nodes.length === 1) return <Slot.Root {...props}>{nodes[0]}</Slot.Root>
  return (
    <>
      {nodes.map((node, index) =>
        index === first ? (
          <Slot.Root key="slot" {...props}>
            {node}
          </Slot.Root>
        ) : (
          node
        ),
      )}
    </>
  )
}
