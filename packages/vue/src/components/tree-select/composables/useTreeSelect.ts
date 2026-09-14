import { computed, ref, shallowRef, watch, type Ref } from 'vue'
import { useFilter } from 'reka-ui'
import { findNode, pathTo, type TreeSelectNode } from '../types'
import { filterTree } from '../utils/filterTree'

interface TreeSelectOptions {
  items: TreeSelectNode[]
  defaultExpanded: Array<string | number>
  searchable?: boolean
}

export function useTreeSelect(
  props: TreeSelectOptions,
  model: Ref<string | number | null | undefined>,
  open: Ref<boolean>,
  search: Ref<string>,
) {
  const selected = computed(() => findNode(props.items, model.value))
  const normalExpanded = ref<string[]>([])
  const searchExpanded = ref<string[]>([])
  const input = shallowRef<{ focus: () => void } | null>(null)
  const tree = shallowRef<{ $el: HTMLElement } | null>(null)
  const { contains } = useFilter({ sensitivity: 'base' })
  const query = computed(() => (props.searchable ? search.value.trim() : ''))
  const filtered = computed(() =>
    query.value ? filterTree(props.items, node => contains(node.label, query.value)) : null,
  )
  const items = computed(() => filtered.value?.items ?? props.items)
  const expanded = computed({
    get: () => (filtered.value ? searchExpanded.value : normalExpanded.value),
    set: value => {
      if (filtered.value) searchExpanded.value = value
      else normalExpanded.value = value
    },
  })

  watch(
    filtered,
    value => {
      searchExpanded.value = value?.expanded ?? []
    },
    { immediate: true },
  )

  watch(
    open,
    (isOpen, wasOpen) => {
      if (!isOpen) {
        if (wasOpen) search.value = ''
        return
      }
      const path = pathTo(props.items, model.value) ?? []
      normalExpanded.value = Array.from(new Set([...props.defaultExpanded, ...path].map(String)))
    },
    { immediate: true },
  )

  function getChildren(node: TreeSelectNode) {
    return filtered.value ? filtered.value.children.get(node) : node.children
  }

  function key(node: TreeSelectNode) {
    return String(node.value)
  }

  function choose(node: TreeSelectNode | undefined) {
    if (!node || node.disabled) return
    model.value = node.value
    open.value = false
  }

  function keepRowClick(event: CustomEvent<{ originalEvent: Event }>) {
    if (event.detail.originalEvent.type === 'click') event.preventDefault()
  }

  function focusSearch(event: Event) {
    if (!props.searchable) return
    event.preventDefault()
    input.value?.focus()
  }

  function clearSearch() {
    search.value = ''
    input.value?.focus()
  }

  function onEscape(event: KeyboardEvent) {
    if (!props.searchable || !search.value) return
    event.preventDefault()
    clearSearch()
  }

  function enabledRows() {
    return Array.from(
      tree.value?.$el.querySelectorAll<HTMLElement>('[role="treeitem"]:not([data-disabled])') ?? [],
    )
  }

  function onSearchKeydown(event: KeyboardEvent) {
    if (event.isComposing || !['ArrowDown', 'ArrowUp'].includes(event.key)) return
    event.preventDefault()
    const rows = enabledRows()
    const target = event.key === 'ArrowDown' ? rows[0] : rows.at(-1)
    target?.focus()
  }

  function onTreeKeydown(event: KeyboardEvent) {
    if (!props.searchable || event.key !== 'ArrowUp' || event.target !== enabledRows()[0]) return
    event.preventDefault()
    event.stopPropagation()
    input.value?.focus()
  }

  return {
    selected,
    items,
    expanded,
    input,
    tree,
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
