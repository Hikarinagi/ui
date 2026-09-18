import { afterEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, reactive, ref, type EffectScope } from 'vue'
import { useDataList } from './composables/useDataList'
import type { DataListProps } from './types'

const items = Array.from({ length: 23 }, (_, id) => ({ id, label: `Item ${id}` }))
const scopes: EffectScope[] = []
afterEach(() => scopes.splice(0).forEach(scope => scope.stop()))

function create(overrides: Partial<DataListProps<(typeof items)[number]>> = {}, initialPage = 1) {
  const props = reactive<DataListProps<(typeof items)[number]>>({
    items,
    itemKey: 'id',
    ...overrides,
  })
  const page = ref(initialPage)
  const size = ref(10)
  const change = vi.fn()
  const scope = effectScope()
  scopes.push(scope)
  const result = scope.run(() => useDataList(props, page, size, change))!
  return { ...result, props, page, size, change }
}

describe('DataList pagination', () => {
  it('renders all items until pagination is enabled and preserves stable keys and global indexes', () => {
    const list = create({}, 2)
    expect(list.entries.value).toHaveLength(23)
    list.props.pagination = true
    expect(list.entries.value).toHaveLength(10)
    expect(list.entries.value[0]).toMatchObject({ item: items[10], index: 10, key: 10 })
    expect(items).toHaveLength(23)
    list.props.itemKey = item => `row-${item.id}`
    expect(list.entries.value[0]?.key).toBe('row-10')
  })

  it('emits once per navigation and resets to the first page when changing page size', async () => {
    const list = create({ pagination: true })
    list.state.value.setPage(2)
    await nextTick()
    expect(list.change).toHaveBeenCalledExactlyOnceWith({ page: 2, pageSize: 10 })
    list.change.mockClear()
    list.state.value.setPageSize(5)
    await nextTick()
    expect(list.change).toHaveBeenCalledExactlyOnceWith({ page: 1, pageSize: 5 })
    expect(list.entries.value).toHaveLength(5)
    list.state.value.setPageSize(5)
    list.state.value.setPage(1)
    expect(list.change).toHaveBeenCalledTimes(1)
  })

  it('returns to a valid page after items are removed', async () => {
    const list = create({ pagination: true }, 3)
    list.props.items = items.slice(0, 8)
    await nextTick()
    expect(list.page.value).toBe(1)
    expect(list.entries.value).toHaveLength(8)
    expect(list.change).toHaveBeenCalledExactlyOnceWith({ page: 1, pageSize: 10 })
    list.props.items = []
    await nextTick()
    expect(list.state.value.pageCount).toBe(1)
    expect(list.state.value.hasNextPage).toBe(false)
  })

  it('never slices a remote page and keeps the global index', () => {
    const list = create({ pagination: true, manual: true, total: 103, items: items.slice(0, 3) }, 8)
    expect(list.entries.value).toHaveLength(3)
    expect(list.entries.value[0]).toMatchObject({ key: 0, index: 70 })
    expect(list.state.value).toMatchObject({ page: 8, pageCount: 11, total: 103 })
  })

  it('supports unknown totals without inventing page counts', async () => {
    const list = create({ pagination: true, manual: true, hasNextPage: true }, 8)
    expect(list.state.value.total).toBeUndefined()
    expect(list.state.value.pageCount).toBeUndefined()
    list.state.value.setPage(9)
    await nextTick()
    expect(list.page.value).toBe(9)
    list.props.hasNextPage = false
    list.state.value.setPage(10)
    expect(list.page.value).toBe(9)
    list.state.value.setPage(8)
    expect(list.page.value).toBe(8)
  })

  it('blocks paging during loading and defers corrections until the result arrives', async () => {
    const list = create({ pagination: true, manual: true, total: 23 }, 3)
    list.props.loading = true
    list.props.total = 0
    list.state.value.setPage(2)
    list.state.value.setPageSize(20)
    await nextTick()
    expect(list.page.value).toBe(3)
    expect(list.size.value).toBe(10)
    expect(list.change).not.toHaveBeenCalled()
    list.props.total = 15
    list.props.loading = false
    await nextTick()
    expect(list.page.value).toBe(2)
    expect(list.change).toHaveBeenCalledExactlyOnceWith({ page: 2, pageSize: 10 })
  })
})
