'use client'

import { Fragment, useEffect, useImperativeHandle, useRef, type ReactNode, type Ref } from 'react'
import type { FlattenedItem } from '../../primitives/tree'
import type { VirtualizeOptions } from '../../lib/virtual/types'
import { useScrollAreaViewport } from '../../lib/virtual/useScrollAreaViewport'
import { ScrollArea, type ScrollAreaHandle } from '../scroll-area/ScrollArea'
import { VirtualTreeWindow, type VirtualTreeWindowHandle } from './VirtualTreeWindow'

export type TreeRowsHandle = VirtualTreeWindowHandle

export interface TreeRowsProps<T extends { label: string; disabled?: boolean }> {
  items: FlattenedItem<T>[]
  virtualize?: VirtualizeOptions
  initialScrollToSelected?: boolean
  maxHeight?: string | number
  scrollable?: boolean
  className?: string
  disabled?: (node: T) => boolean
  children: (props: { item: FlattenedItem<T> }) => ReactNode
  empty?: ReactNode
  ref?: Ref<TreeRowsHandle>
}

export function TreeRows<T extends { label: string; disabled?: boolean }>({
  items,
  virtualize,
  initialScrollToSelected,
  maxHeight,
  scrollable,
  className,
  disabled,
  children,
  empty,
  ref,
}: TreeRowsProps<T>) {
  const area = useRef<ScrollAreaHandle>(null)
  const viewport = useScrollAreaViewport(area)
  const window = useRef<VirtualTreeWindowHandle>(null)

  useEffect(() => {
    viewport?.setAttribute('role', 'group')
  }, [viewport])

  useImperativeHandle(ref, () => ({
    focusFirst: () => window.current?.focusFirst(),
    focusLast: () => window.current?.focusLast(),
    isFirst: (element: EventTarget | null) => window.current?.isFirst(element) ?? false,
  }))

  const rows = items.map(item => <Fragment key={item._id}>{children({ item })}</Fragment>)

  if (!virtualize && !scrollable) return <>{rows}</>

  return (
    <ScrollArea
      ref={area}
      className={className}
      style={{ maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }}
    >
      {virtualize ? (
        <VirtualTreeWindow<T>
          ref={window}
          items={items}
          virtualize={virtualize}
          initialScrollToSelected={initialScrollToSelected}
          viewport={viewport}
          disabled={disabled}
        >
          {children}
        </VirtualTreeWindow>
      ) : (
        rows
      )}
      {!items.length && empty}
    </ScrollArea>
  )
}
