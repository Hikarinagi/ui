import { computed, watch, type Ref } from 'vue'

interface PaginationOptions {
  total: number
  pageSize: number
  siblingCount: number
  disabled?: boolean
}

function integer(value: number, fallback: number, minimum: number) {
  return Number.isFinite(value) ? Math.max(minimum, Math.floor(value)) : fallback
}

export function usePagination(props: PaginationOptions, model: Ref<number>) {
  const total = computed(() => integer(props.total, 0, 0))
  const pageSize = computed(() => integer(props.pageSize, 10, 1))
  const siblingCount = computed(() => integer(props.siblingCount, 1, 0))
  const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
  const clamp = (value: number) => Math.min(pageCount.value, integer(value, 1, 1))
  const page = computed(() => clamp(model.value))

  watch(
    [model, pageCount],
    () => {
      if (model.value !== page.value) model.value = page.value
    },
    { immediate: true },
  )

  function update(value: number) {
    const next = clamp(value)
    if (!props.disabled && model.value !== next) model.value = next
  }

  return { total, pageSize, siblingCount, pageCount, page, update }
}
