'use client'

import { useImperativeHandle, type ReactNode, type Ref } from 'react'
import type { FlattenedItem } from '../../primitives/tree'
import type { VirtualizeOptions } from '../../lib/virtual/types'
import { useVirtualTree } from '../../lib/virtual/useVirtualTree'
import { virtualListContent, virtualListItem } from '../virtual-list/virtual-list.variants'

export interface VirtualTreeWindowHandle {
  focusFirst(): void
  focusLast(): void
  isFirst(element: EventTarget | null): boolean
}

export interface VirtualTreeWindowProps<T extends { label: string; disabled?: boolean }> {
  items: FlattenedItem<T>[]
  virtualize?: VirtualizeOptions
  initialScrollToSelected?: boolean
  viewport?: HTMLElement
  disabled?: (node: T) => boolean
  children: (props: { item: FlattenedItem<T> }) => ReactNode
  ref?: Ref<VirtualTreeWindowHandle>
}

export function VirtualTreeWindow<T extends { label: string; disabled?: boolean }>({
  items,
  virtualize,
  initialScrollToSelected,
  viewport,
  disabled,
  children,
  ref,
}: VirtualTreeWindowProps<T>) {
  const { body, entries, bodyStyle, measure, focusFirst, focusLast, isFirst } = useVirtualTree<T>(
    { items, virtualize, initialScrollToSelected, disabled },
    viewport,
  )
  useImperativeHandle(ref, () => ({ focusFirst, focusLast, isFirst }))

  return (
    <div
      ref={body as Ref<HTMLDivElement>}
      data-hn-virtual-tree=""
      role="presentation"
      className={virtualListContent({ orientation: 'vertical' })}
      style={bodyStyle}
    >
      {entries.map(entry => (
        <div
          key={entry.key}
          ref={element => measure(element)}
          data-index={entry.index}
          role="presentation"
          className={virtualListItem({ orientation: 'vertical' })}
          style={{ marginBlockStart: `${entry.gapBefore}px` }}
        >
          {children({ item: items[entry.index]! })}
        </div>
      ))}
    </div>
  )
}
