'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import type { TreeItemToggleEvent } from '../../../primitives/tree'
import { createCollatorFilter } from '../../../../../shared/src/lib/virtual/filter'
import { filterTree } from '../../../../../shared/src/lib/tree-select/filter'
import type { TreeRowsHandle } from '../../tree/TreeRows'
import type { TreeSelectSearchHandle } from '../TreeSelectSearch'
import { findNode, pathTo, type TreeSelectNode } from '../types'

export type TreeSelectValue = string | number | null | undefined

interface Options {
  items: TreeSelectNode[]
  defaultExpanded: Array<string | number>
  searchable?: boolean
  virtualize?: unknown
}

function openedExpanded(
  items: TreeSelectNode[],
  defaultExpanded: Array<string | number>,
  model: TreeSelectValue,
) {
  const path = pathTo(items, model) ?? []
  return Array.from(new Set([...defaultExpanded, ...path].map(String)))
}

export function useTreeSelect(
  props: Options,
  model: TreeSelectValue,
  setModel: (value: TreeSelectValue) => void,
  open: boolean,
  setOpen: (open: boolean) => void,
  search: string,
  setSearch: (search: string) => void,
) {
  const selected = findNode(props.items, model)
  const [normalExpanded, setNormalExpanded] = useState<string[]>(() =>
    open ? openedExpanded(props.items, props.defaultExpanded, model) : [],
  )
  const input = useRef<TreeSelectSearchHandle>(null)
  const tree = useRef<HTMLElement>(null)
  const rows = useRef<TreeRowsHandle>(null)
  const [{ contains }] = useState(() => createCollatorFilter({ sensitivity: 'base' }))
  const query = props.searchable ? search.trim() : ''
  const filtered = useMemo(
    () => (query ? filterTree(props.items, node => contains(node.label, query)) : null),
    [query, props.items, contains],
  )
  const items = filtered?.items ?? props.items

  const [searchExpanded, setSearchExpanded] = useState<string[]>(() => filtered?.expanded ?? [])
  const [previousFiltered, setPreviousFiltered] = useState(filtered)
  let currentSearchExpanded = searchExpanded
  if (previousFiltered !== filtered) {
    setPreviousFiltered(filtered)
    currentSearchExpanded = filtered?.expanded ?? []
    setSearchExpanded(currentSearchExpanded)
  }

  const [previousOpen, setPreviousOpen] = useState(open)
  let currentNormalExpanded = normalExpanded
  if (previousOpen !== open) {
    setPreviousOpen(open)
    if (open) {
      currentNormalExpanded = openedExpanded(props.items, props.defaultExpanded, model)
      setNormalExpanded(currentNormalExpanded)
    }
  }

  const wasOpen = useRef(open)
  useEffect(() => {
    if (!open && wasOpen.current) setSearch('')
    wasOpen.current = open
  }, [open, setSearch])

  const expanded = filtered ? currentSearchExpanded : currentNormalExpanded
  function setExpanded(value: string[]) {
    if (filtered) setSearchExpanded(value)
    else setNormalExpanded(value)
  }

  const getChildren = useCallback(
    (node: TreeSelectNode) => (filtered ? filtered.children.get(node) : node.children),
    [filtered],
  )
  const key = useCallback((node: TreeSelectNode) => String(node.value), [])

  function choose(node: TreeSelectNode | undefined) {
    if (!node || node.disabled) return
    setModel(node.value)
    setOpen(false)
  }

  function keepRowClick(event: TreeItemToggleEvent<TreeSelectNode>) {
    if (event.detail.originalEvent.type === 'click') event.preventDefault()
  }

  function focusSearch(event: Event) {
    if (!props.searchable) return
    event.preventDefault()
    input.current?.focus()
  }

  function clearSearch() {
    setSearch('')
    input.current?.focus()
  }

  function onEscape(event: globalThis.KeyboardEvent) {
    if (!props.searchable || !search) return
    event.preventDefault()
    clearSearch()
  }

  function enabledRows() {
    return Array.from(
      tree.current?.querySelectorAll<HTMLElement>('[role="treeitem"]:not([data-disabled])') ?? [],
    )
  }

  function onSearchKeydown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing || !['ArrowDown', 'ArrowUp'].includes(event.key)) return
    event.preventDefault()
    if (props.virtualize) {
      if (event.key === 'ArrowDown') rows.current?.focusFirst()
      else rows.current?.focusLast()
      return
    }
    const enabled = enabledRows()
    const target = event.key === 'ArrowDown' ? enabled[0] : enabled.at(-1)
    target?.focus()
  }

  function onTreeKeydown(event: KeyboardEvent<HTMLElement>) {
    if (
      !props.searchable ||
      event.key !== 'ArrowUp' ||
      !(props.virtualize ? rows.current?.isFirst(event.target) : event.target === enabledRows()[0])
    )
      return
    event.preventDefault()
    event.stopPropagation()
    input.current?.focus()
  }

  return {
    selected,
    items,
    expanded,
    setExpanded,
    input,
    tree,
    rows,
    getChildren,
    key,
    choose,
    keepRowClick,
    focusSearch,
    clearSearch,
    onEscape,
    onSearchKeydown,
    onTreeKeydown,
  }
}
