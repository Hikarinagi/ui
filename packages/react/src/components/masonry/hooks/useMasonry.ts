'use client'

import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { layoutMasonry, masonryColumns } from '../../../../../shared/src/lib/masonry'
import type { MasonryKey, MasonryLayout } from '../types'

export interface MasonryOptions<T> {
  items: readonly T[]
  getKey: (item: T, index: number) => MasonryKey
  columns?: number
  minColumnWidth?: number
  gap?: string
  sequential?: boolean
  className?: string
}

interface MasonryEntry<T> {
  item: T
  key: MasonryKey
  index: number
}

interface MasonrySettings {
  entries: MasonryEntry<unknown>[]
  minWidth: number
  fixedColumns: number | undefined
  sequential: boolean | undefined
}

function setStyle(node: HTMLElement, name: string, value: string) {
  if (node.style.getPropertyValue(name) !== value) node.style.setProperty(name, value)
}

function createMasonry(
  list: { readonly current: HTMLElement | null },
  spacing: { readonly current: HTMLElement | null },
  settings: () => MasonrySettings,
  setHasLayout: (value: boolean) => void,
  onLayout: (layout: MasonryLayout) => void,
) {
  const nodes = new Map<MasonryKey, HTMLElement>()
  const keys = new WeakMap<Element, MasonryKey>()
  const heights = new Map<MasonryKey, number>()
  const refs = new Map<MasonryKey, (node: HTMLElement | null) => void>()
  let observer: ResizeObserver | undefined
  let frame = 0
  let alive = false
  let remeasure = true
  let columnWidth = -1
  let lastWidth = -1
  let lastLayout: MasonryLayout | undefined

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
    const host = list.current
    if (!alive || !host || !host.getClientRects().length) return
    const { entries, minWidth, fixedColumns, sequential } = settings()
    const css = getComputedStyle(host)
    const width = Number.parseFloat(css.width)
    if (!(width > 0)) return
    const gapX = Number.parseFloat(css.columnGap) || 0
    const gapY = Number.parseFloat(css.rowGap) || 0
    const count = masonryColumns(width, minWidth, gapX, fixedColumns)
    const nextColumnWidth = Math.max(0, (width - (count - 1) * gapX) / count)
    const resize = Math.abs(nextColumnWidth - columnWidth) > 0.01
    lastWidth = width
    columnWidth = nextColumnWidth
    setStyle(host, '--hn-masonry-columns', String(count))

    const sizes = entries.map(({ key }) => {
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
    const layout = layoutMasonry(sizes, count, gapY, sequential)
    entries.forEach(({ key }, index) => {
      const node = nodes.get(key)
      if (!node) return
      const position = layout.positions[index]!
      setStyle(node, '--hn-masonry-column', String(position.column))
      setStyle(node, '--hn-masonry-top', `${position.top}px`)
    })
    setStyle(host, '--hn-masonry-height', `${layout.height}px`)
    if (!host.hasAttribute('data-ready')) host.setAttribute('data-ready', '')
    setHasLayout(entries.length > 0)
    if (lastLayout?.columns !== count || lastLayout?.height !== layout.height) {
      lastLayout = { columns: count, height: layout.height }
      onLayout(lastLayout)
    }
  }

  function prune(active: Set<MasonryKey>) {
    for (const key of refs.keys()) if (!active.has(key)) refs.delete(key)
    schedule()
  }

  function mount() {
    if (typeof ResizeObserver === 'undefined') {
      setHasLayout(true)
      return
    }
    alive = true
    observer = new ResizeObserver(records => {
      let changed = false
      for (const record of records) {
        if (record.target === spacing.current) {
          changed = true
        } else if (record.target === list.current) {
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
    if (list.current) observer.observe(list.current)
    if (spacing.current) observer.observe(spacing.current)
    for (const node of nodes.values()) observer.observe(node, { box: 'border-box' })
    update()
  }

  function unmount() {
    alive = false
    observer?.disconnect()
    cancelAnimationFrame(frame)
  }

  return {
    get alive() {
      return alive
    },
    itemRef,
    measure,
    prune,
    mount,
    unmount,
  }
}

export function useMasonry<T>(
  options: MasonryOptions<T>,
  onLayout: (layout: MasonryLayout) => void,
) {
  const element = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const spacing = useRef<HTMLSpanElement>(null)
  const [hasLayout, setHasLayout] = useState(false)
  const { items, getKey, columns, minColumnWidth } = options
  const entries = useMemo(
    () => items.map((item, index) => ({ item, key: getKey(item, index), index })),
    [items, getKey],
  )
  const minWidth =
    minColumnWidth !== undefined && Number.isFinite(minColumnWidth) && minColumnWidth > 0
      ? minColumnWidth
      : 240
  const fixedColumns =
    columns !== undefined && Number.isFinite(columns) ? Math.max(1, Math.floor(columns)) : undefined
  const listStyle = {
    '--hn-masonry-min-width': `${minWidth}px`,
    '--hn-masonry-fixed-columns': fixedColumns,
  } as CSSProperties

  const latest = useRef({
    entries,
    minWidth,
    fixedColumns,
    sequential: options.sequential,
    onLayout,
  })
  latest.current = { entries, minWidth, fixedColumns, sequential: options.sequential, onLayout }
  const [masonry] = useState(() =>
    createMasonry(
      list,
      spacing,
      () => latest.current as MasonrySettings,
      setHasLayout,
      layout => latest.current.onLayout(layout),
    ),
  )

  const [count, setCount] = useState(entries.length)
  if (count !== entries.length) {
    setCount(entries.length)
    if (!entries.length && masonry.alive) setHasLayout(false)
  }

  const focused = useRef<HTMLElement | undefined>(undefined)
  const root = element.current
  if (root) {
    const active = root.ownerDocument.activeElement
    focused.current = active instanceof HTMLElement && root.contains(active) ? active : undefined
  }
  useLayoutEffect(() => {
    const target = focused.current
    if (
      target?.isConnected &&
      element.current?.contains(target) &&
      target.ownerDocument.activeElement === target.ownerDocument.body
    ) {
      target.focus({ preventScroll: true })
    }
    focused.current = undefined
  })

  const watched = useRef({ entries: false, settings: false })
  useLayoutEffect(() => {
    if (!watched.current.entries) {
      watched.current.entries = true
      return
    }
    masonry.prune(new Set(entries.map(entry => entry.key)))
  }, [masonry, entries])
  useLayoutEffect(() => {
    if (!watched.current.settings) {
      watched.current.settings = true
      return
    }
    masonry.measure()
  }, [
    masonry,
    options.columns,
    options.minColumnWidth,
    options.gap,
    options.sequential,
    options.className,
  ])
  useLayoutEffect(() => {
    masonry.mount()
    return masonry.unmount
  }, [masonry])

  return {
    element,
    list,
    spacing,
    listStyle,
    fixedColumns,
    entries,
    itemRef: masonry.itemRef,
    measure: masonry.measure,
    hasLayout,
  }
}
