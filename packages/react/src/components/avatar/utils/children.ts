import { Children, Fragment, isValidElement, type ReactElement, type ReactNode } from 'react'
import { resolveChild } from '../../../lib/children'

export function flattenChildren(nodes: ReactNode): ReactNode[] {
  return Children.toArray(nodes)
    .map(resolveChild)
    .flatMap(node =>
      isValidElement(node) && node.type === Fragment
        ? flattenChildren((node as ReactElement<{ children?: ReactNode }>).props.children)
        : [node],
    )
}
