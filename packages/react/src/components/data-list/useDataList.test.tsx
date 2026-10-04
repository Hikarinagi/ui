import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, renderHook } from '@testing-library/react'
import { useState } from 'react'
import { useDataList } from './hooks/useDataList'
import type { DataListOptions } from './types'

const items = Array.from({ length: 23 }, (_, id) => ({ id, label: `Item ${id}` }))
type Item = (typeof items)[number]
afterEach(cleanup)

function create(overrides: Partial<DataListOptions<Item>> = {}, initialPage = 1) {
  const change = vi.fn()
  const models = { page: initialPage, size: 10 }
  const { result, rerender } = renderHook(
    (props: DataListOptions<Item>) => {
      const page = useState(initialPage)
      const size = useState(10)
      models.page = page[0]
      models.size = size[0]
      return useDataList(props, page, size, change)
    },
    { initialProps: { items, itemKey: 'id', ...overrides } as DataListOptions<Item> },
  )
  let props = { items, itemKey: 'id', ...overrides } as DataListOptions<Item>
  return {
    get entries() {
      return result.current.entries
    },
    get state() {
      return result.current.state
    },
    get page() {
      return models.page
    },
    get size() {
      return models.size
    },
    change,
    set(next: Partial<DataListOptions<Item>>) {
      props = { ...props, ...next }
      act(() => rerender(props))
    },
    act(action: () => void) {
      act(action)
    },
  }
}

describe('DataList pagination', () => {
  it('renders all items until pagination is enabled and preserves stable keys and global indexes', () => {
    const list = create({}, 2)
    expect(list.entries).toHaveLength(23)
    list.set({ pagination: true })
    expect(list.entries).toHaveLength(10)
    expect(list.entries[0]).toMatchObject({ item: items[10], index: 10, key: 10 })
    expect(items).toHaveLength(23)
    list.set({ itemKey: item => `row-${item.id}` })
    expect(list.entries[0]?.key).toBe('row-10')
  })

  it('emits once per navigation and resets to the first page when changing page size', () => {
    const list = create({ pagination: true })
    list.act(() => list.state.setPage(2))
    expect(list.change).toHaveBeenCalledExactlyOnceWith({ page: 2, pageSize: 10 })
    list.change.mockClear()
    list.act(() => list.state.setPageSize(5))
    expect(list.change).toHaveBeenCalledExactlyOnceWith({ page: 1, pageSize: 5 })
    expect(list.entries).toHaveLength(5)
    list.act(() => {
      list.state.setPageSize(5)
      list.state.setPage(1)
    })
    expect(list.change).toHaveBeenCalledTimes(1)
  })

  it('returns to a valid page after items are removed', () => {
    const list = create({ pagination: true }, 3)
    list.set({ items: items.slice(0, 8) })
    expect(list.page).toBe(1)
    expect(list.entries).toHaveLength(8)
    expect(list.change).toHaveBeenCalledExactlyOnceWith({ page: 1, pageSize: 10 })
    list.set({ items: [] })
    expect(list.state.pageCount).toBe(1)
    expect(list.state.hasNextPage).toBe(false)
  })

  it('never slices a remote page and keeps the global index', () => {
    const list = create({ pagination: true, manual: true, total: 103, items: items.slice(0, 3) }, 8)
    expect(list.entries).toHaveLength(3)
    expect(list.entries[0]).toMatchObject({ key: 0, index: 70 })
    expect(list.state).toMatchObject({ page: 8, pageCount: 11, total: 103 })
  })

  it('supports unknown totals without inventing page counts', () => {
    const list = create({ pagination: true, manual: true, hasNextPage: true }, 8)
    expect(list.state.total).toBeUndefined()
    expect(list.state.pageCount).toBeUndefined()
    list.act(() => list.state.setPage(9))
    expect(list.page).toBe(9)
    list.set({ hasNextPage: false })
    list.act(() => list.state.setPage(10))
    expect(list.page).toBe(9)
    list.act(() => list.state.setPage(8))
    expect(list.page).toBe(8)
  })

  it('blocks paging during loading and defers corrections until the result arrives', () => {
    const list = create({ pagination: true, manual: true, total: 23 }, 3)
    list.set({ loading: true, total: 0 })
    list.act(() => {
      list.state.setPage(2)
      list.state.setPageSize(20)
    })
    expect(list.page).toBe(3)
    expect(list.size).toBe(10)
    expect(list.change).not.toHaveBeenCalled()
    list.set({ total: 15, loading: false })
    expect(list.page).toBe(2)
    expect(list.change).toHaveBeenCalledExactlyOnceWith({ page: 2, pageSize: 10 })
  })
})
