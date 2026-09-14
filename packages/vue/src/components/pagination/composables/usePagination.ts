import { computed, watch, type Ref } from 'vue'
import type { PaginationChange, PaginationState } from '../types'

interface PaginationOptions {
  total: number
  itemCount?: number
  siblingCount: number
  pageSizeOptions?: number[]
  disabled?: boolean
  pending?: boolean
}

export function paginationInteger(value: number, fallback: number, minimum: number) {
  return Number.isFinite(value) ? Math.max(minimum, Math.floor(value)) : fallback
}

export function usePagination(
  props: PaginationOptions,
  model: Ref<number>,
  sizeModel: Ref<number>,
  change: (value: PaginationChange) => void,
) {
  const total = computed(() => paginationInteger(props.total, 0, 0))
  const pageSize = computed(() => paginationInteger(sizeModel.value, 10, 1))
  const siblingCount = computed(() => paginationInteger(props.siblingCount, 1, 0))
  const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
  const clamp = (value: number) => Math.min(pageCount.value, paginationInteger(value, 1, 1))
  const page = computed(() => clamp(model.value))
  const blocked = computed(() => !!(props.disabled || props.pending))
  const state = computed<PaginationState>(() => {
    const count =
      props.itemCount === undefined ? pageSize.value : paginationInteger(props.itemCount, 0, 0)
    const from = total.value && count ? (page.value - 1) * pageSize.value + 1 : 0
    return {
      page: page.value,
      pageSize: pageSize.value,
      pageCount: pageCount.value,
      total: total.value,
      from,
      to: from ? Math.min(total.value, from + count - 1) : 0,
    }
  })
  const sizes = computed(() =>
    [...new Set([...(props.pageSizeOptions ?? []), pageSize.value])]
      .filter(value => Number.isInteger(value) && value > 0)
      .sort((a, b) => a - b),
  )

  watch(
    [model, pageCount, () => props.pending],
    () => {
      if (props.pending || model.value === page.value) return
      const next = page.value
      model.value = next
      change({ page: next, pageSize: pageSize.value })
    },
    { immediate: true },
  )

  function update(value: number) {
    const next = clamp(value)
    if (blocked.value || page.value === next) return
    model.value = next
    change({ page: next, pageSize: pageSize.value })
  }

  function resize(value: number) {
    const next = paginationInteger(value, pageSize.value, 1)
    if (blocked.value || pageSize.value === next) return
    sizeModel.value = next
    if (model.value !== 1) model.value = 1
    change({ page: 1, pageSize: next })
  }

  return { total, pageSize, siblingCount, pageCount, page, state, blocked, sizes, update, resize }
}
