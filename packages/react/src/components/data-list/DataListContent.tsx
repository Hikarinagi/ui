'use client'

import {
  Fragment,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from 'react'
import { flushSync } from 'react-dom'
import { ScrollArea, type ScrollAreaHandle } from '../scroll-area/ScrollArea'
import { cn } from '../../lib/cn'
import { useDataListWindow } from './hooks/useDataListWindow'
import {
  dataListContent,
  dataListViewport,
  dataListItem,
  dataListSpacer,
} from './data-list.variants'
import type {
  DataListExpose,
  DataListItemSlot,
  DataListLayout,
  DataListOptions,
  DataListRange,
} from './types'

export interface DataListContentProps<T> {
  options: DataListOptions<T>
  entries: readonly DataListItemSlot<T>[]
  layout: DataListLayout
  structured: boolean
  placeholderCount: number
  itemClass: (entry: DataListItemSlot<T>, structured: boolean) => string
  onRangeChange: (range: DataListRange) => void
  renderItem: (props: DataListItemSlot<T>) => ReactNode
  renderPlaceholder: (props: { index: number; layout: DataListLayout }) => ReactNode
  ref?: Ref<DataListExpose>
}

function useBoundedViewport(area: { current: ScrollAreaHandle | null }, bounded: boolean) {
  const [viewport, setViewport] = useState<HTMLElement>()
  useEffect(() => {
    if (!bounded) return
    let frame = requestAnimationFrame(function check() {
      const element = area.current?.viewport
      if (element) flushSync(() => setViewport(element))
      else frame = requestAnimationFrame(check)
    })
    return () => {
      cancelAnimationFrame(frame)
      setViewport(undefined)
    }
  }, [area, bounded])
  return bounded ? viewport : undefined
}

export function DataListContent<T>({
  options,
  entries,
  layout,
  structured,
  placeholderCount,
  itemClass,
  onRangeChange,
  renderItem,
  renderPlaceholder,
  ref,
}: DataListContentProps<T>) {
  const content = useRef<HTMLUListElement>(null)
  const area = useRef<ScrollAreaHandle>(null)
  const bounded = !!options.virtualize || options.height !== undefined
  const viewport = useBoundedViewport(area, bounded)
  const initialLoading = !!options.loading && !entries.length
  const { rendered, style, before, after, scrollToIndex, updateFocus, focusOut } =
    useDataListWindow({ options, entries, layout }, content, viewport, onRangeChange)
  const viewportRef = useRef(viewport)
  viewportRef.current = viewport

  useImperativeHandle(
    ref,
    () => ({
      get viewport() {
        return viewportRef.current
      },
      scrollToIndex,
    }),
    [scrollToIndex],
  )

  const list = (
    <ul
      ref={content}
      data-hn-data-list-content=""
      role="list"
      aria-label={options.label}
      aria-hidden={initialLoading || undefined}
      inert={options.loading || undefined}
      className={cn(
        dataListContent({ layout, gap: layout === 'grid' ? (options.gridGap ?? 'md') : 'none' }),
        options.contentClass,
      )}
      style={style}
      onFocus={updateFocus}
      onBlur={focusOut}
    >
      {initialLoading ? (
        <Fragment key="placeholders">
          {Array.from({ length: placeholderCount }, (_, index) => (
            <li
              key={index + 1}
              className={dataListItem({
                layout,
                divided: options.divided,
                size: options.size,
                structured,
              })}
            >
              {renderPlaceholder({ index, layout })}
            </li>
          ))}
        </Fragment>
      ) : (
        <Fragment key="items">
          {[
            before ? (
              <li
                key="hn-before"
                role="presentation"
                aria-hidden="true"
                className={dataListSpacer()}
                style={{ height: `${before}px` }}
              />
            ) : null,
            ...rendered.map(entry => (
              <li
                key={entry.key}
                data-hn-data-list-item=""
                data-index={entry.index}
                data-virtual-row={entry.row}
                aria-posinset={options.virtualize ? entry.index + 1 : undefined}
                aria-setsize={
                  options.virtualize
                    ? options.manual
                      ? (options.total ?? -1)
                      : options.items.length
                    : undefined
                }
                className={itemClass(entry, structured)}
                style={entry.gapBefore ? { marginBlockStart: `${entry.gapBefore}px` } : undefined}
              >
                {renderItem(entry)}
              </li>
            )),
            after ? (
              <li
                key="hn-after"
                role="presentation"
                aria-hidden="true"
                className={dataListSpacer()}
                style={{ height: `${after}px` }}
              />
            ) : null,
          ]}
        </Fragment>
      )}
    </ul>
  )

  return bounded ? (
    <ScrollArea ref={area} label={options.label} focusable className={dataListViewport()}>
      {list}
    </ScrollArea>
  ) : (
    <div>{list}</div>
  )
}
