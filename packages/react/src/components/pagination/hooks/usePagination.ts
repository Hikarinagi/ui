'use client'

import { useLayoutEffect, useMemo, useRef } from 'react'
import { paginationInteger } from '../../../../../shared/src/lib/pagination'
import type { PaginationChange, PaginationState } from '../types'
import { useControllableState } from '../../../primitives/utils/controllable-state'

export { paginationInteger }

interface PaginationOptions {
  total: number
  itemCount?: number
  siblingCount: number
  pageSizeOptions?: number[]
  disabled?: boolean
  pending?: boolean
  value?: number
  defaultValue: number
  onValueChange?: (value: number) => void
  pageSize?: number
  defaultPageSize: number
  onPageSizeChange?: (value: number) => void
}

export function usePagination(props: PaginationOptions, change: (value: PaginationChange) => void) {
  const [model, setModel] = useControllableState<number>({
    prop: props.value,
    defaultProp: props.defaultValue,
    onChange: props.onValueChange,
    caller: 'Pagination',
  })
  const [sizeModel, setSizeModel] = useControllableState<number>({
    prop: props.pageSize,
    defaultProp: props.defaultPageSize,
    onChange: props.onPageSizeChange,
    caller: 'Pagination',
  })
  const total = paginationInteger(props.total, 0, 0)
  const pageSize = paginationInteger(sizeModel, 10, 1)
  const siblingCount = paginationInteger(props.siblingCount, 1, 0)
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const clamp = (value: number) => Math.min(pageCount, paginationInteger(value, 1, 1))
  const page = clamp(model)
  const blocked = !!(props.disabled || props.pending)
  const count = props.itemCount === undefined ? pageSize : paginationInteger(props.itemCount, 0, 0)
  const from = total && count ? (page - 1) * pageSize + 1 : 0
  const to = from ? Math.min(total, from + count - 1) : 0
  const state = useMemo<PaginationState>(
    () => ({ page, pageSize, pageCount, total, from, to }),
    [page, pageSize, pageCount, total, from, to],
  )
  const options = props.pageSizeOptions
  const sizes = useMemo(
    () =>
      [...new Set([...(options ?? []), pageSize])]
        .filter(value => Number.isInteger(value) && value > 0)
        .sort((a, b) => a - b),
    [options, pageSize],
  )

  const watched = useRef<readonly unknown[] | undefined>(undefined)
  useLayoutEffect(() => {
    const next = [model, pageCount, props.pending]
    const previous = watched.current
    if (previous && next.every((value, index) => Object.is(value, previous[index]))) return
    watched.current = next
    if (props.pending || model === page) return
    setModel(page)
    change({ page, pageSize })
  }, [model, pageCount, props.pending])

  function update(value: number) {
    const next = clamp(value)
    if (blocked || page === next) return
    setModel(next)
    change({ page: next, pageSize })
  }

  function resize(value: number) {
    const next = paginationInteger(value, pageSize, 1)
    if (blocked || pageSize === next) return
    setSizeModel(next)
    if (model !== 1) setModel(1)
    change({ page: 1, pageSize: next })
  }

  return { total, pageSize, siblingCount, pageCount, page, state, blocked, sizes, update, resize }
}
