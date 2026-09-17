import { computed, nextTick, onScopeDispose, shallowRef, watch, type Ref } from 'vue'
import { useVirtualWindow, virtualFlow } from '../../../lib/virtual/useVirtualWindow'
import type { DataTableKey, DataTableProps } from '../types'
import type { DataTableController } from './useDataTable'

export function useTableVirtual<T extends object>(
  props: DataTableProps<T>,
  ctl: DataTableController<T>,
  element: Ref<HTMLTableElement | undefined>,
  viewport: Ref<HTMLElement | undefined>,
  hasExpansion: () => boolean,
  rowError: (key: DataTableKey) => string | undefined,
) {
  const margin = shallowRef(0)
  let observer: ResizeObserver | undefined
  let disposed = false
  const entries = computed(() =>
    ctl.rows.value.flatMap(entry => {
      const rows = [{ id: entry.id, entry, detail: false, error: undefined as string | undefined }]
      if (!entry.group) {
        const error = rowError(entry.key)
        if (error) rows.push({ id: `${entry.id}:error`, entry, detail: true, error })
        if (entry.expanded && hasExpansion())
          rows.push({ id: `${entry.id}:detail`, entry, detail: true, error: undefined })
      }
      return rows
    }),
  )
  watch(element, async () => {
    await nextTick()
    observer?.disconnect()
    const head = element.value?.tHead
    if (disposed || !head || typeof ResizeObserver === 'undefined') return
    const update = () => {
      margin.value = head.offsetHeight + (element.value?.caption?.offsetHeight ?? 0)
    }
    observer = new ResizeObserver(update)
    observer.observe(head)
    if (element.value?.caption) observer.observe(element.value.caption)
    update()
  })
  const virtualizer = useVirtualWindow(
    computed(() => ({
      count: entries.value.length,
      enabled: !!props.virtualize,
      getScrollElement: () => viewport.value ?? null,
      estimateSize: (index: number) =>
        entries.value[index]?.detail && !entries.value[index]?.error
          ? 140
          : typeof props.virtualize === 'object'
            ? (props.virtualize.estimateSize ?? 44)
            : 44,
      overscan: typeof props.virtualize === 'object' ? (props.virtualize.overscan ?? 6) : 6,
      getItemKey: (index: number) => entries.value[index]!.id,
      scrollMargin: margin.value,
      scrollPaddingStart: props.stickyHeader ? margin.value : 0,
      initialRect: { width: 0, height: 400 },
    })),
  )
  const window = computed(() => virtualizer.value.getVirtualItems())
  const visible = computed(() =>
    props.virtualize
      ? window.value.map(item => ({ ...entries.value[item.index]!, index: item.index }))
      : entries.value.map((entry, index) => ({ ...entry, index })),
  )
  const flow = computed(() =>
    virtualFlow(window.value, virtualizer.value.getTotalSize(), margin.value),
  )
  const before = computed(() => (props.virtualize ? flow.value.before : 0))
  const after = computed(() => (props.virtualize ? flow.value.after : 0))
  function measure(element: unknown) {
    if (element === null) {
      virtualizer.value.measureElement(null)
      return
    }
    if (props.virtualize && element instanceof HTMLElement)
      virtualizer.value.measureElement(element)
  }
  ctl.api.scrollToRow = key => {
    const index = entries.value.findIndex(
      item => !item.detail && item.entry.key === key && !item.entry.group,
    )
    if (index < 0) return
    if (props.virtualize) virtualizer.value.scrollToIndex(index, { align: 'start' })
    else {
      const row = element.value?.querySelector<HTMLElement>(
        `[data-hn-row="${CSS.escape(entries.value[index]!.id)}"]`,
      )
      if (row && viewport.value)
        viewport.value.scrollTop +=
          row.getBoundingClientRect().top -
          viewport.value.getBoundingClientRect().top -
          (props.stickyHeader ? margin.value : 0)
    }
  }
  onScopeDispose(() => {
    disposed = true
    observer?.disconnect()
  })
  return { entries, visible, before, after, measure }
}

export type DataTableRenderEntry<T extends object> = ReturnType<
  typeof useTableVirtual<T>
>['visible']['value'][number]
