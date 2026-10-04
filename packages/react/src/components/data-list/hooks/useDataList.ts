'use client'

import { useLayoutEffect, useMemo, useRef } from 'react'
import { paginationInteger } from '../../../../../shared/src/lib/pagination'
import { dataListText } from '../../../../../shared/src/lib/data-list'
import { cn } from '../../../lib/cn'
import { dataListItem } from '../data-list.variants'
import type {
  DataListKey,
  DataListItemSlot,
  DataListLayout,
  DataListOptions,
  DataListPageChange,
  DataListState,
} from '../types'

type Model<V> = readonly [V, (value: V) => void]

export function useDataList<T>(
  props: DataListOptions<T>,
  pageModel: Model<number>,
  sizeModel: Model<number>,
  change: (value: DataListPageChange) => void,
  layoutModel?: Model<DataListLayout>,
  layoutProp?: DataListLayout,
) {
  const [pageValue, setPageModel] = pageModel
  const [sizeValue, setSizeModel] = sizeModel
  const layout = layoutModel?.[0] ?? layoutProp ?? 'list'
  const pageSize = paginationInteger(sizeValue, 10, 1)
  const total = props.manual
    ? props.total === undefined
      ? undefined
      : paginationInteger(props.total, 0, 0)
    : props.items.length
  const pageCount = total === undefined ? undefined : Math.max(1, Math.ceil(total / pageSize))
  const clamp = (value: number) => Math.min(pageCount ?? Infinity, paginationInteger(value, 1, 1))
  const page = props.pagination ? clamp(pageValue) : 1
  const offset = props.pagination ? (page - 1) * pageSize : 0
  const items = props.items
  const paged = !!props.pagination && !props.manual
  const visible = useMemo(
    () => (paged ? items.slice(offset, offset + pageSize) : items),
    [paged, items, offset, pageSize],
  )
  const itemKey = props.itemKey
  const entries = useMemo<DataListItemSlot<T>[]>(
    () =>
      visible.map((item, index) => ({
        item,
        index: offset + index,
        key:
          typeof itemKey === 'function'
            ? itemKey(item, offset + index)
            : (item[itemKey as keyof T] as DataListKey),
        layout,
      })),
    [visible, offset, itemKey, layout],
  )
  const formatItem = (entry: DataListItemSlot<T>) => ({
    title: dataListText(entry.item, entry.index, props.itemTitle as never),
    description: dataListText(entry.item, entry.index, props.itemDescription as never),
  })
  function setPage(value: number) {
    const next = clamp(value)
    if (props.loading || next === page) return
    if (pageCount === undefined && next > page && !props.hasNextPage) return
    setPageModel(next)
    change({ page: next, pageSize })
  }
  function setPageSize(value: number) {
    const next = paginationInteger(value, pageSize, 1)
    if (props.loading || next === pageSize) return
    setSizeModel(next)
    setPageModel(1)
    change({ page: 1, pageSize: next })
  }

  const watched = useRef<readonly unknown[] | undefined>(undefined)
  useLayoutEffect(() => {
    const next = [page, pageValue, props.loading]
    const previous = watched.current
    if (previous && next.every((value, index) => Object.is(value, previous[index]))) return
    watched.current = next
    if (!props.pagination || props.loading || pageValue === page) return
    setPageModel(page)
    change({ page, pageSize })
  }, [page, pageValue, props.loading])

  const state: DataListState<T> = {
    items: visible,
    total,
    page,
    pageSize,
    pageCount,
    layout,
    loading: !!props.loading,
    refreshing: !!props.loading && visible.length > 0,
    hasPreviousPage: page > 1,
    hasNextPage: pageCount === undefined ? !!props.hasNextPage : page < pageCount,
    setPage,
    setPageSize,
    setLayout: value => {
      layoutModel?.[1](value)
    },
  }
  const itemClass = (entry: { item: T; index: number }, structured = true) =>
    cn(
      dataListItem({ layout, divided: props.divided, size: props.size, structured }),
      typeof props.itemClass === 'function'
        ? props.itemClass(entry.item, entry.index)
        : props.itemClass,
    )
  const placeholderCount = paginationInteger(
    props.placeholderCount ?? NaN,
    props.pagination && !props.virtualize ? pageSize : 3,
    1,
  )
  const showPagination =
    !!props.pagination &&
    (total === undefined
      ? state.hasPreviousPage || state.hasNextPage || state.loading
      : total > pageSize)
  return { entries, state, itemClass, placeholderCount, showPagination, formatItem }
}
