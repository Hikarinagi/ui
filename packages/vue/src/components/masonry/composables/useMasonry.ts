import {
  computed,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  onUpdated,
  shallowRef,
  watch,
} from 'vue'
import { layoutMasonry, masonryColumns } from '../../../../../shared/src/lib/masonry'
import type { MasonryKey, MasonryLayout, MasonryProps } from '../types'

export function useMasonry<T>(props: MasonryProps<T>, onLayout: (layout: MasonryLayout) => void) {
  const element = shallowRef<HTMLElement>()
  const list = shallowRef<HTMLElement>()
  const spacing = shallowRef<HTMLElement>()
  const hasLayout = shallowRef(false)
  const entries = computed(() =>
    props.items.map((item, index) => ({ item, key: props.getKey(item, index), index })),
  )
  const minWidth = computed(() =>
    Number.isFinite(props.minColumnWidth) && props.minColumnWidth! > 0
      ? props.minColumnWidth!
      : 240,
  )
  const fixedColumns = computed(() =>
    props.columns !== undefined && Number.isFinite(props.columns)
      ? Math.max(1, Math.floor(props.columns))
      : undefined,
  )
  const listStyle = computed(() => ({
    '--hn-masonry-min-width': `${minWidth.value}px`,
    '--hn-masonry-fixed-columns': fixedColumns.value,
  }))
  const nodes = new Map<MasonryKey, HTMLElement>()
  const keys = new WeakMap<Element, MasonryKey>()
  const heights = new Map<MasonryKey, number>()
  const refs = new Map<MasonryKey, (node: unknown) => void>()
  let observer: ResizeObserver | undefined
  let frame = 0
  let alive = false
  let remeasure = true
  let columnWidth = -1
  let lastWidth = -1
  let lastLayout: MasonryLayout | undefined
  let focused: HTMLElement | undefined

  onBeforeUpdate(() => {
    const active = element.value?.ownerDocument.activeElement
    focused = active instanceof HTMLElement && element.value?.contains(active) ? active : undefined
  })
  onUpdated(() => {
    if (
      focused?.isConnected &&
      element.value?.contains(focused) &&
      focused.ownerDocument.activeElement === focused.ownerDocument.body
    ) {
      focused.focus({ preventScroll: true })
    }
    focused = undefined
  })

  function setStyle(node: HTMLElement, name: string, value: string) {
    if (node.style.getPropertyValue(name) !== value) node.style.setProperty(name, value)
  }
  function schedule() {
    if (alive && !frame) frame = requestAnimationFrame(update)
  }
  function measure() {
    remeasure = true
    schedule()
  }
  function itemRef(key: MasonryKey) {
    if (!refs.has(key))
      refs.set(key, node => {
        const previous = nodes.get(key)
        if (previous === node) return
        if (previous) {
          observer?.unobserve(previous)
          keys.delete(previous)
        }
        if (node instanceof HTMLElement) {
          nodes.set(key, node)
          keys.set(node, key)
          heights.delete(key)
          observer?.observe(node, { box: 'border-box' })
        } else {
          nodes.delete(key)
          heights.delete(key)
        }
        schedule()
      })
    return refs.get(key)!
  }

  function update() {
    frame = 0
    const host = list.value
    if (!alive || !host || !host.getClientRects().length) return
    const css = getComputedStyle(host)
    const width = Number.parseFloat(css.width)
    if (!(width > 0)) return
    const gapX = Number.parseFloat(css.columnGap) || 0
    const gapY = Number.parseFloat(css.rowGap) || 0
    const count = masonryColumns(width, minWidth.value, gapX, fixedColumns.value)
    const nextColumnWidth = Math.max(0, (width - (count - 1) * gapX) / count)
    const resize = Math.abs(nextColumnWidth - columnWidth) > 0.01
    lastWidth = width
    columnWidth = nextColumnWidth
    setStyle(host, '--hn-masonry-columns', String(count))

    const sizes = entries.value.map(({ key }) => {
      const node = nodes.get(key)
      if (node && (resize || remeasure || !heights.has(key))) {
        const style = getComputedStyle(node)
        const extra =
          style.boxSizing === 'border-box'
            ? 0
            : (
                ['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth'] as const
              ).reduce((sum, name) => sum + (Number.parseFloat(style[name]) || 0), 0)
        heights.set(key, (Number.parseFloat(style.height) || 0) + extra)
      }
      return heights.get(key) ?? 0
    })
    remeasure = false
    const layout = layoutMasonry(sizes, count, gapY, props.sequential)
    entries.value.forEach(({ key }, index) => {
      const node = nodes.get(key)
      if (!node) return
      const position = layout.positions[index]!
      setStyle(node, '--hn-masonry-column', String(position.column))
      setStyle(node, '--hn-masonry-top', `${position.top}px`)
    })
    setStyle(host, '--hn-masonry-height', `${layout.height}px`)
    if (!host.hasAttribute('data-ready')) host.setAttribute('data-ready', '')
    hasLayout.value = entries.value.length > 0
    if (lastLayout?.columns !== count || lastLayout?.height !== layout.height) {
      lastLayout = { columns: count, height: layout.height }
      onLayout(lastLayout)
    }
  }

  watch(
    entries,
    value => {
      const active = new Set(value.map(entry => entry.key))
      for (const key of refs.keys()) if (!active.has(key)) refs.delete(key)
      schedule()
    },
    { flush: 'post' },
  )
  watch(
    () => entries.value.length,
    count => {
      if (!count && alive) hasLayout.value = false
    },
    { flush: 'sync' },
  )
  watch(
    () => [props.columns, props.minColumnWidth, props.gap, props.sequential, props.class],
    measure,
    { flush: 'post' },
  )
  onMounted(() => {
    if (typeof ResizeObserver === 'undefined') {
      hasLayout.value = true
      return
    }
    alive = true
    observer = new ResizeObserver(records => {
      let changed = false
      for (const record of records) {
        if (record.target === spacing.value) {
          changed = true
        } else if (record.target === list.value) {
          if (Math.abs(record.contentRect.width - lastWidth) > 0.01) changed = true
        } else {
          const key = keys.get(record.target)
          const height = record.borderBoxSize[0]?.blockSize
          if (key !== undefined && height !== undefined && heights.get(key) !== height) {
            heights.set(key, height)
            changed = true
          }
        }
      }
      if (changed) schedule()
    })
    if (list.value) observer.observe(list.value)
    if (spacing.value) observer.observe(spacing.value)
    for (const node of nodes.values()) observer.observe(node, { box: 'border-box' })
    update()
  })
  onBeforeUnmount(() => {
    alive = false
    observer?.disconnect()
    cancelAnimationFrame(frame)
  })
  return { element, list, spacing, listStyle, fixedColumns, entries, itemRef, measure, hasLayout }
}
