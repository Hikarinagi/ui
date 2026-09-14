import { computed, type Ref } from 'vue'
import type { TreeNode, TreeNodeState, TreeValue } from '../types'
import { checkedState, indexTree, toggleChecked } from '../utils/selection'

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
  const states = computed(() => {
    if (props.multiple)
      return checkedState(index.value, Array.isArray(model.value) ? model.value : [])
    return new Map(
      [...index.value.entries].map(([value, entry]) => [
        value,
        {
          selected: value === model.value,
          indeterminate: false,
          disabled: entry.disabled,
        },
      ]),
    )
  })
  const selected = computed(() =>
    [...index.value.entries.values()]
      .filter(entry => states.value.get(entry.node.value)?.selected)
      .map(entry => entry.node),
  )
  const keys = computed(
    () => new Map([...index.value.entries].map(([value, entry]) => [key(entry.node), value])),
  )
  const expanded = computed({
    get: () => (expandedModel.value ?? initialExpanded).map(value => key({ value })),
    set: value => {
      expandedModel.value = value.flatMap(key =>
        keys.value.has(key) ? [keys.value.get(key)!] : [],
      )
    },
  })

  function key(node: Pick<TreeNode, 'value'>) {
    return `${typeof node.value}:${node.value}`
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
    model.value = props.multiple
      ? toggleChecked(index.value, Array.isArray(model.value) ? model.value : [], node.value)
      : model.value === node.value
        ? null
        : node.value
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
