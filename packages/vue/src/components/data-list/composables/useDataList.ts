import { computed, watch, type Ref } from 'vue'
import { paginationInteger } from '../../pagination/composables/usePagination'
import { cn } from '../../../lib/cn'
import { dataListItem } from '../data-list.variants'
import type {
  DataListKey,
  DataListItemSlot,
  DataListLayout,
  DataListPageChange,
  DataListProps,
  DataListState,
  DataListTextField,
} from '../types'

export function useDataList<T>(
  props: DataListProps<T>,
  pageModel: Ref<number>,
  sizeModel: Ref<number>,
  change: (value: DataListPageChange) => void,
  layoutModel?: Ref<DataListLayout>,
) {
  const layout = computed(() => layoutModel?.value ?? props.layout ?? 'list')
  function text(item: T, index: number, field: DataListTextField<T> | undefined) {
    const value = typeof field === 'function' ? field(item, index) : field ? item[field] : undefined
    return value !== '' && (typeof value === 'string' || typeof value === 'number')
      ? value
      : undefined
  }
  const pageSize = computed(() => paginationInteger(sizeModel.value, 10, 1))
  const total = computed(() =>
    props.manual
      ? props.total === undefined
        ? undefined
        : paginationInteger(props.total, 0, 0)
      : props.items.length,
  )
  const pageCount = computed(() =>
    total.value === undefined ? undefined : Math.max(1, Math.ceil(total.value / pageSize.value)),
  )
  const clamp = (value: number) =>
    Math.min(pageCount.value ?? Infinity, paginationInteger(value, 1, 1))
  const page = computed(() => (props.pagination ? clamp(pageModel.value) : 1))
  const offset = computed(() => (props.pagination ? (page.value - 1) * pageSize.value : 0))
  const visible = computed(() =>
    props.pagination && !props.manual
      ? props.items.slice(offset.value, offset.value + pageSize.value)
      : props.items,
  )
  const entries = computed(() =>
    visible.value.map((item, index) => ({
      item,
      index: offset.value + index,
      key:
        typeof props.itemKey === 'function'
          ? props.itemKey(item, offset.value + index)
          : (item[props.itemKey] as DataListKey),
      layout: layout.value,
    })),
  )
  const formatItem = (entry: DataListItemSlot<T>) => ({
    title: text(entry.item, entry.index, props.itemTitle),
    description: text(entry.item, entry.index, props.itemDescription),
  })
  function setPage(value: number) {
    const next = clamp(value)
    if (props.loading || next === page.value) return
    if (pageCount.value === undefined && next > page.value && !props.hasNextPage) return
    pageModel.value = next
    change({ page: next, pageSize: pageSize.value })
  }
  function setPageSize(value: number) {
    const next = paginationInteger(value, pageSize.value, 1)
    if (props.loading || next === pageSize.value) return
    sizeModel.value = next
    pageModel.value = 1
    change({ page: 1, pageSize: next })
  }
  watch(
    [page, pageModel, () => props.loading],
    () => {
      if (!props.pagination || props.loading || pageModel.value === page.value) return
      pageModel.value = page.value
      change({ page: page.value, pageSize: pageSize.value })
    },
    { immediate: true },
  )
  const state = computed<DataListState<T>>(() => ({
    items: visible.value,
    total: total.value,
    page: page.value,
    pageSize: pageSize.value,
    pageCount: pageCount.value,
    layout: layout.value,
    loading: !!props.loading,
    refreshing: !!props.loading && visible.value.length > 0,
    hasPreviousPage: page.value > 1,
    hasNextPage: pageCount.value === undefined ? !!props.hasNextPage : page.value < pageCount.value,
    setPage,
    setPageSize,
    setLayout: value => {
      if (layoutModel) layoutModel.value = value
    },
  }))
  const itemClass = (entry: { item: T; index: number }, structured = true) =>
    cn(
      dataListItem({ layout: layout.value, divided: props.divided, size: props.size, structured }),
      typeof props.itemClass === 'function'
        ? props.itemClass(entry.item, entry.index)
        : props.itemClass,
    )
  const placeholderCount = computed(() =>
    paginationInteger(
      props.placeholderCount ?? NaN,
      props.pagination && !props.virtualize ? pageSize.value : 3,
      1,
    ),
  )
  const showPagination = computed(
    () =>
      props.pagination &&
      (total.value === undefined
        ? state.value.hasPreviousPage || state.value.hasNextPage || state.value.loading
        : total.value > pageSize.value),
  )
  return { entries, state, itemClass, placeholderCount, showPagination, formatItem }
}
