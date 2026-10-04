'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useTreeRootContext, type FlattenedItem } from '../../primitives/tree'
import { createChoiceTypeahead } from '../../../../shared/src/lib/virtual/choices'
import {
  survivingTreeAncestor,
  virtualTreeDisabled,
  virtualTreeKeyTarget,
} from '../../../../shared/src/lib/virtual/tree'
import { nextEnabled } from './navigation'
import type { VirtualizeOptions } from './types'
import { useRenderTick } from './useRenderTick'
import { useVirtualCollection } from './useVirtualCollection'

export interface VirtualTreeOptions<T> {
  items: FlattenedItem<T>[]
  virtualize?: VirtualizeOptions
  initialScrollToSelected?: boolean
  disabled?: (node: T) => boolean
}

export function useVirtualTree<T extends { label: string; disabled?: boolean }>(
  props: VirtualTreeOptions<T>,
  viewport: HTMLElement | undefined,
) {
  const root = useTreeRootContext<T>('VirtualTreeWindow')
  const body = useRef<HTMLElement | null>(null)
  const active = useRef<string | undefined>(undefined)
  const tick = useRenderTick()
  const { items } = props
  const index = items.findIndex(item => item._id === active.current)
  const disabled = (i: number) => virtualTreeDisabled(items, i, root.disabled, props.disabled)
  const selected = items.findIndex(item => root.selectedKeys.includes(item._id))
  const collection = useVirtualCollection({
    items,
    key: item => item._id,
    config: props.virtualize,
    initialIndex: props.initialScrollToSelected ? selected : undefined,
    viewport,
    body,
    retain: [index, selected],
  })
  const virtualizer = collection.virtualizer
  const first = () => nextEnabled(items.length, 0, 1, disabled)
  const last = () => nextEnabled(items.length, items.length - 1, -1, disabled)
  const latest = useRef({ items, root, viewport, index, selected, disabled, first, last })
  latest.current = { items, root, viewport, index, selected, disabled, first, last }
  const generation = useRef(0)
  const disposed = useRef(false)
  const [typeahead] = useState(() => createChoiceTypeahead())

  const previousItems = useRef(items)
  const pending = useRef<{ old: FlattenedItem<T>[]; inside: boolean } | null>(null)
  if (previousItems.current !== items) {
    pending.current = {
      old: previousItems.current,
      inside: typeof document !== 'undefined' && !!body.current?.contains(document.activeElement),
    }
    previousItems.current = items
  }

  const focus = useCallback(
    async (target: number, moveFocus = true, align: 'auto' | 'center' = 'auto') => {
      const { items, disabled } = latest.current
      if (target < 0 || disabled(target)) return
      const version = ++generation.current
      const key = items[target]!._id
      active.current = key
      await tick()
      if (
        disposed.current ||
        generation.current !== version ||
        latest.current.items[target]?._id !== key
      )
        return
      virtualizer.scrollToIndex(target, { align })
      if (moveFocus)
        body.current
          ?.querySelector<HTMLElement>(`[data-index="${target}"] [role="treeitem"]`)
          ?.focus({ preventScroll: true })
    },
    [tick, virtualizer],
  )

  useEffect(() => {
    const element = body.current
    if (!element) return
    const keydown = (event: KeyboardEvent) => {
      const { items, root, viewport, index, disabled } = latest.current
      if (event.defaultPrevented || event.isComposing || root.disabled) return
      const target = virtualTreeKeyTarget(event, {
        rows: items,
        current: index,
        expanded: root.expanded,
        dir: root.dir,
        page: viewport?.clientHeight ?? 320,
        getKey: root.getKey,
        disabled,
        typeahead,
      })
      if (target === undefined) return
      event.preventDefault()
      event.stopImmediatePropagation()
      void focus(target)
    }
    const remember = (event: Event) => {
      const wrapper = (event.target as Element).closest<HTMLElement>('[data-index]')
      if (wrapper && body.current?.contains(wrapper)) {
        active.current = latest.current.items[Number(wrapper.dataset.index)]?._id
        void tick()
      }
    }
    element.addEventListener('keydown', keydown, { capture: true })
    element.addEventListener('focusin', remember)
    return () => {
      element.removeEventListener('keydown', keydown, { capture: true })
      element.removeEventListener('focusin', remember)
    }
  }, [focus, tick, typeahead])

  useEffect(() => {
    const change = pending.current
    pending.current = null
    if (!change) return
    const { items, root, index, first } = latest.current
    if (index >= 0 || !active.current) return
    const target = survivingTreeAncestor(items, change.old, active.current, root.getKey)
    void focus(target >= 0 ? target : first(), change.inside)
  }, [items, focus])

  const previousViewport = useRef(viewport)
  useEffect(() => {
    if (previousViewport.current === viewport) return
    previousViewport.current = viewport
    const { selected, first } = latest.current
    if (viewport) void focus(selected >= 0 ? selected : first(), false, 'center')
  }, [viewport, focus])

  useEffect(() => {
    disposed.current = false
    const previous = root.isVirtual.current
    root.isVirtual.current = true
    return () => {
      disposed.current = true
      generation.current++
      root.isVirtual.current = previous
    }
  }, [root.isVirtual])

  return {
    body,
    ...collection,
    focusFirst: () => focus(latest.current.first()),
    focusLast: () => focus(latest.current.last()),
    isFirst: (element: EventTarget | null) =>
      element ===
      body.current?.querySelector(`[data-index="${latest.current.first()}"] [role="treeitem"]`),
  }
}
