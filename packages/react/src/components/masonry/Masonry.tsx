'use client'

import { useImperativeHandle } from 'react'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { useUiLocale } from '../../locale'
import { Spinner } from '../spinner/Spinner'
import {
  masonry,
  masonryItem,
  masonryList,
  masonryMeasure,
  masonryStatus,
} from './masonry.variants'
import { useMasonry } from './hooks/useMasonry'
import type { MasonryProps } from './types'

export function Masonry<T>({
  items,
  getKey,
  columns,
  minColumnWidth = 240,
  gap = 'md',
  sequential = false,
  loading = false,
  emptyText,
  label,
  dir,
  itemClass,
  onLayout,
  children,
  empty,
  loadingContent,
  pending: pendingContent,
  className,
  ref,
  ...attrs
}: MasonryProps<T>) {
  const t = useUiLocale()
  const { element, list, spacing, listStyle, fixedColumns, entries, itemRef, measure, hasLayout } =
    useMasonry({ items, getKey, columns, minColumnWidth, gap, sequential, className }, value =>
      onLayout?.(value),
    )
  const pending = hasContent(pendingContent) && !hasLayout && (items.length > 0 || loading)

  useImperativeHandle(
    ref,
    () => ({
      get element() {
        return element.current ?? undefined
      },
      measure,
    }),
    [element, measure],
  )

  return (
    <div
      data-hn-masonry=""
      dir={dir}
      aria-busy={pending || loading}
      {...attrs}
      ref={element}
      className={cn(masonry({ gap }), className)}
    >
      <span ref={spacing} aria-hidden="true" className={masonryMeasure()} />
      <div className="relative min-w-0">
        <ul
          ref={list}
          role="list"
          aria-label={label}
          aria-busy={pending || loading}
          aria-hidden={pending ? true : undefined}
          inert={pending ? true : undefined}
          data-pending={pending ? '' : undefined}
          className={masonryList()}
          style={listStyle}
          data-fixed-columns={fixedColumns ? '' : undefined}
        >
          {entries.map(entry => (
            <li
              key={entry.key}
              ref={itemRef(entry.key)}
              className={cn(
                masonryItem(),
                typeof itemClass === 'function' ? itemClass(entry.item, entry.index) : itemClass,
              )}
            >
              {typeof children === 'function'
                ? children({ item: entry.item, index: entry.index })
                : children}
            </li>
          ))}
        </ul>
        {pending && (
          <div data-hn-masonry-pending="" role="status" aria-label={t.common.loading}>
            {pendingContent}
          </div>
        )}
      </div>
      {loading && !pending ? (
        <div className={masonryStatus()} role="status">
          {hasContent(loadingContent) ? (
            loadingContent
          ) : (
            <>
              <Spinner size="sm" aria-hidden="true" />
              <span>{t.common.loading}</span>
            </>
          )}
        </div>
      ) : !items.length && !pending ? (
        <div className={masonryStatus()}>
          {hasContent(empty) ? empty : (emptyText ?? t.masonry.empty)}
        </div>
      ) : null}
    </div>
  )
}
