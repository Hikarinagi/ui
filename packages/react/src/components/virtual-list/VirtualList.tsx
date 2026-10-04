'use client'

import { useImperativeHandle } from 'react'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { useUiLocale } from '../../locale'
import { ScrollArea } from '../scroll-area/ScrollArea'
import { LoadingOverlay } from '../loading-overlay/LoadingOverlay'
import { useVirtualList } from './hooks/useVirtualList'
import {
  virtualList,
  virtualListContent,
  virtualListItem,
  virtualListStatus,
} from './virtual-list.variants'
import type { VirtualListProps } from './types'

export type {
  VirtualListExpose,
  VirtualListKey,
  VirtualListProps,
  VirtualListRange,
  VirtualListScrollOptions,
  VirtualListSlotProps,
} from './types'

export function VirtualList<T>(props: VirtualListProps<T>) {
  const {
    items,
    getKey: _getKey,
    estimateSize: _estimateSize,
    dynamic: _dynamic,
    height: _height,
    orientation = 'vertical',
    dir: _dir,
    overscan: _overscan,
    gap: _gap,
    paddingStart: _paddingStart,
    paddingEnd: _paddingEnd,
    initialRect: _initialRect,
    initialOffset: _initialOffset,
    loading = false,
    emptyText,
    label,
    shadow = true,
    className,
    itemClass,
    onRangeChange,
    children,
    empty,
    loadingContent,
    style,
    ref,
    ...attrs
  } = props
  const resolved = {
    ...props,
    estimateSize: props.estimateSize ?? 48,
    dynamic: props.dynamic ?? true,
    height: props.height ?? 320,
    orientation,
    overscan: props.overscan ?? 5,
    gap: props.gap ?? 0,
    paddingStart: props.paddingStart ?? 0,
    paddingEnd: props.paddingEnd ?? 0,
    initialOffset: props.initialOffset ?? 0,
  }
  const t = useUiLocale()
  const {
    root,
    rootDirection,
    area,
    list,
    viewport,
    entries,
    contentStyle,
    rootStyle,
    itemStyle,
    measureElement,
    measure,
    updateFocus,
    onFocusOut,
    scrollToIndex,
    scrollToOffset,
  } = useVirtualList(resolved, range => onRangeChange?.(range))

  useImperativeHandle(
    ref,
    () => ({
      viewport,
      scrollToIndex,
      scrollToOffset,
      measure: () => void measure(),
    }),
    [viewport, scrollToIndex, scrollToOffset, measure],
  )

  return (
    <div
      ref={root}
      data-hn-virtual-list=""
      dir={rootDirection}
      {...attrs}
      className={cn(virtualList(), className)}
      style={{ ...rootStyle, ...style }}
    >
      <ScrollArea
        ref={area}
        className="min-h-0 flex-1"
        direction={orientation}
        shadow={shadow}
        label={label}
        focusable
      >
        <ul
          ref={list}
          role="list"
          aria-busy={loading}
          className={virtualListContent({ orientation })}
          style={contentStyle}
          onFocus={updateFocus}
          onBlur={onFocusOut}
        >
          {entries.map(entry => (
            <li
              key={entry.key}
              ref={element => measureElement(element)}
              data-index={entry.index}
              aria-posinset={entry.index + 1}
              aria-setsize={items.length}
              className={cn(
                virtualListItem({ orientation }),
                typeof itemClass === 'function'
                  ? itemClass(items[entry.index]!, entry.index)
                  : itemClass,
              )}
              style={itemStyle(entry)}
            >
              {children?.({ item: items[entry.index]!, index: entry.index })}
            </li>
          ))}
        </ul>
      </ScrollArea>
      {!items.length && !loading && (
        <div className={cn(virtualListStatus(), 'absolute inset-0')}>
          {hasContent(empty) ? empty : (emptyText ?? t.virtualList.empty)}
        </div>
      )}
      <LoadingOverlay visible={loading} text={t.common.loading} delay={0} size="sm">
        {loadingContent}
      </LoadingOverlay>
    </div>
  )
}
