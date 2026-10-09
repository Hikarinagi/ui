'use client'

import { useCallback, useMemo, useState } from 'react'
import type { TreeItemSelectEvent, TreeItemToggleEvent } from '../../../primitives/tree'
import type { TreeNode, TreeNodeState, TreeValue } from '../types'
import {
  expandedTreeKeys,
  expandedTreeValues,
  indexTree,
  nextTreeModel,
  selectedTreeNodes,
  treeKey,
  treeKeyMap,
  treeStates,
} from '../../../../../shared/src/lib/tree/selection'
import { useControllableState } from '../../../primitives/utils/controllable-state'

export type TreeModel = TreeValue | TreeValue[] | null

interface Options {
  items: TreeNode[]
  multiple?: boolean
  defaultExpanded: TreeValue[]
  value?: TreeModel
  defaultValue?: TreeModel
  onValueChange?: (value: TreeModel) => void
  expanded?: TreeValue[]
  onExpandedChange?: (value: TreeValue[]) => void
  disabled: boolean
}

export function useTree(props: Options) {
  const [initialExpanded] = useState(() => [...props.defaultExpanded])
  const [model, setModel] = useControllableState<TreeModel | undefined>({
    prop: props.value,
    defaultProp: props.defaultValue,
    onChange: value => props.onValueChange?.(value as TreeModel),
    caller: 'Tree',
  })
  const [expandedModel, setExpandedModel] = useControllableState<TreeValue[] | undefined>({
    prop: props.expanded,
    defaultProp: undefined,
    onChange: value => {
      if (value) props.onExpandedChange?.(value)
    },
    caller: 'Tree',
  })
  const { items, multiple, disabled } = props
  const index = useMemo(() => indexTree(items), [items])
  const states = useMemo(() => treeStates(index, multiple, model), [index, multiple, model])
  const selected = useMemo(() => selectedTreeNodes(index, states), [index, states])
  const keys = useMemo(() => treeKeyMap(index), [index])
  const expandedValues = expandedModel ?? initialExpanded
  const expanded = useMemo(() => expandedTreeKeys(expandedValues), [expandedValues])

  function setExpanded(value: string[]) {
    setExpandedModel(expandedTreeValues(keys, value))
  }
  const key = useCallback((node: Pick<TreeNode, 'value'>) => treeKey(node), [])
  const getChildren = useCallback(
    (node: TreeNode) => (node.children?.length ? node.children : undefined),
    [],
  )
  function state(node: TreeNode): TreeNodeState {
    const value = states.get(node.value)!
    return { ...value, disabled: disabled || value.disabled }
  }
  function select(event: TreeItemSelectEvent<TreeNode>) {
    event.preventDefault()
    const node = event.detail.value
    if (!node || state(node).disabled) return
    setModel(nextTreeModel(index, multiple, model, node.value))
  }
  function toggle(node: TreeNode) {
    if (state(node).disabled || !getChildren(node)) return
    const value = key(node)
    setExpanded(
      expanded.includes(value) ? expanded.filter(key => key !== value) : [...expanded, value],
    )
  }
  function keepRowClick(event: TreeItemToggleEvent<TreeNode>) {
    if (event.detail.originalEvent.type === 'click') event.preventDefault()
  }
  return {
    selected,
    expanded,
    setExpanded,
    key,
    getChildren,
    state,
    select,
    toggle,
    keepRowClick,
  }
}
