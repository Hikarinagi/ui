import { computed, type Ref } from 'vue'
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
} from '../utils/selection'

interface Options {
  items: TreeNode[]
  multiple?: boolean
  defaultExpanded: TreeValue[]
}

export function useTree(
  props: Options,
  model: Ref<TreeValue | TreeValue[] | null | undefined>,
  expandedModel: Ref<TreeValue[] | undefined>,
  disabled: Ref<boolean>,
) {
  const initialExpanded = [...props.defaultExpanded]
  const index = computed(() => indexTree(props.items))
  const states = computed(() => treeStates(index.value, props.multiple, model.value))
  const selected = computed(() => selectedTreeNodes(index.value, states.value))
  const keys = computed(() => treeKeyMap(index.value))
  const expanded = computed({
    get: () => expandedTreeKeys(expandedModel.value ?? initialExpanded),
    set: value => {
      expandedModel.value = expandedTreeValues(keys.value, value)
    },
  })

  function key(node: Pick<TreeNode, 'value'>) {
    return treeKey(node)
  }
  function getChildren(node: TreeNode) {
    return node.children?.length ? node.children : undefined
  }
  function state(node: TreeNode): TreeNodeState {
    const value = states.value.get(node.value)!
    return { ...value, disabled: disabled.value || value.disabled }
  }
  function select(event: CustomEvent<{ value?: TreeNode }>) {
    event.preventDefault()
    const node = event.detail.value
    if (!node || state(node).disabled) return
    model.value = nextTreeModel(index.value, props.multiple, model.value, node.value)
  }
  function toggle(node: TreeNode) {
    if (state(node).disabled || !getChildren(node)) return
    const value = key(node)
    expanded.value = expanded.value.includes(value)
      ? expanded.value.filter(key => key !== value)
      : [...expanded.value, value]
  }
  function keepRowClick(event: CustomEvent<{ originalEvent: Event }>) {
    if (event.detail.originalEvent.type === 'click') event.preventDefault()
  }
  return { selected, expanded, key, getChildren, state, select, toggle, keepRowClick }
}
