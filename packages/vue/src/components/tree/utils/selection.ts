import type { TreeNode, TreeNodeState, TreeValue } from '../types'

interface Entry {
  node: TreeNode
  parent?: TreeValue
  children: TreeValue[]
  disabled: boolean
}

export interface TreeIndex {
  roots: TreeValue[]
  entries: Map<TreeValue, Entry>
}

export function indexTree(nodes: TreeNode[]): TreeIndex {
  const entries = new Map<TreeValue, Entry>()
  function visit(node: TreeNode, parent?: TreeValue, disabled = false) {
    const entry = {
      node,
      parent,
      disabled: disabled || !!node.disabled,
      children: node.children?.map(child => child.value) ?? [],
    }
    entries.set(node.value, entry)
    node.children?.forEach(child => visit(child, node.value, entry.disabled))
  }
  nodes.forEach(node => visit(node))
  return { roots: nodes.map(node => node.value), entries }
}

export function checkedState(tree: TreeIndex, values: TreeValue[]) {
  const checked = new Set(values)
  const states = new Map<TreeValue, TreeNodeState>()
  function visit(value: TreeValue, inherited = false): TreeNodeState {
    const entry = tree.entries.get(value)!
    const own = checked.has(value) || (!entry.disabled && inherited)
    const children = entry.children.map(child => visit(child, !entry.disabled && own))
    const enabled = children.filter(child => !child.disabled)
    const selected =
      entry.disabled || enabled.length === 0 ? own : enabled.every(child => child.selected)
    const indeterminate =
      !entry.disabled && !selected && enabled.some(child => child.selected || child.indeterminate)
    const state = { selected, indeterminate, disabled: entry.disabled }
    states.set(value, state)
    return state
  }
  tree.roots.forEach(value => visit(value))
  return states
}

export function toggleChecked(tree: TreeIndex, values: TreeValue[], value: TreeValue): TreeValue[] {
  const entry = tree.entries.get(value)
  if (!entry || entry.disabled) return values
  const states = checkedState(tree, values)
  const checked = new Set(values.filter(value => !tree.entries.has(value)))
  states.forEach((state, value) => {
    if (state.selected) checked.add(value)
  })
  const selected = !states.get(value)!.selected
  function visit(value: TreeValue) {
    const entry = tree.entries.get(value)!
    if (entry.disabled) return
    if (selected) checked.add(value)
    else checked.delete(value)
    entry.children.forEach(visit)
  }
  visit(value)
  let parent = entry.parent
  while (parent !== undefined) {
    checked.delete(parent)
    parent = tree.entries.get(parent)!.parent
  }
  const next = checkedState(tree, [...checked])
  return [
    ...[...checked].filter(value => !tree.entries.has(value)),
    ...[...tree.entries.keys()].filter(value => next.get(value)!.selected),
  ]
}
