import { computed, nextTick, onScopeDispose, shallowRef, watch, type Ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { injectTreeRootContext, type FlattenedItem } from 'reka-ui'
import { useVirtualCollection } from '../virtual/useVirtualCollection'
import { nextEnabled } from '../virtual/navigation'
import type { VirtualizeOptions } from '../virtual/types'
import { createChoiceTypeahead } from '../../../../shared/src/lib/virtual/choices'
import {
  survivingTreeAncestor,
  virtualTreeDisabled,
  virtualTreeKeyTarget,
} from '../../../../shared/src/lib/virtual/tree'

export function useVirtualTree<T extends { label: string; disabled?: boolean }>(
  props: {
    items: FlattenedItem<T>[]
    virtualize?: VirtualizeOptions
    initialScrollToSelected?: boolean
    disabled?: (node: T) => boolean
  },
  viewport: Ref<HTMLElement | undefined>,
) {
  const root = injectTreeRootContext()
  const body = shallowRef<HTMLElement>()
  const active = shallowRef<string>()
  const index = computed(() => props.items.findIndex(item => item._id === active.value))
  const disabled = (i: number) =>
    virtualTreeDisabled(props.items, i, root.disabled.value, props.disabled)
  const selected = computed(() =>
    props.items.findIndex(item => root.selectedKeys.value.includes(item._id)),
  )
  const collection = useVirtualCollection({
    items: () => props.items,
    key: item => item._id,
    config: () => props.virtualize,
    initialIndex: props.initialScrollToSelected ? () => selected.value : undefined,
    viewport,
    body,
    retain: () => [index.value, selected.value],
  })
  const previous = root.isVirtual.value
  root.isVirtual.value = true
  let generation = 0
  let disposed = false
  async function focus(target: number, moveFocus = true, align: 'auto' | 'center' = 'auto') {
    if (target < 0 || disabled(target)) return
    const version = ++generation
    const key = props.items[target]!._id
    active.value = key
    await nextTick()
    if (disposed || generation !== version || props.items[target]?._id !== key) return
    collection.virtualizer.value.scrollToIndex(target, { align })
    if (moveFocus)
      body.value
        ?.querySelector<HTMLElement>(`[data-index="${target}"] [role="treeitem"]`)
        ?.focus({ preventScroll: true })
  }
  const first = () => nextEnabled(props.items.length, 0, 1, disabled)
  const last = () => nextEnabled(props.items.length, props.items.length - 1, -1, disabled)
  const typeahead = createChoiceTypeahead()
  function keydown(event: KeyboardEvent) {
    if (event.defaultPrevented || event.isComposing || root.disabled.value) return
    const target = virtualTreeKeyTarget(event, {
      rows: props.items,
      current: index.value,
      expanded: root.expanded.value,
      dir: root.dir.value,
      page: viewport.value?.clientHeight ?? 320,
      getKey: root.getKey,
      disabled,
      typeahead,
    })
    if (target === undefined) return
    event.preventDefault()
    event.stopImmediatePropagation()
    void focus(target)
  }
  useEventListener(body, 'keydown', keydown, { capture: true })
  useEventListener(body, 'focusin', event => {
    const wrapper = (event.target as Element).closest<HTMLElement>('[data-index]')
    if (wrapper && body.value?.contains(wrapper))
      active.value = props.items[Number(wrapper.dataset.index)]?._id
  })
  watch(
    () => props.items,
    (items, old) => {
      if (index.value >= 0 || !active.value) return
      const target = survivingTreeAncestor(items, old, active.value, root.getKey)
      void focus(target >= 0 ? target : first(), body.value?.contains(document.activeElement))
    },
    { flush: 'pre' },
  )
  watch(
    viewport,
    element => {
      if (element) void focus(selected.value >= 0 ? selected.value : first(), false, 'center')
    },
    { flush: 'post' },
  )
  onScopeDispose(() => {
    disposed = true
    generation++
    root.isVirtual.value = previous
  })
  return {
    body,
    ...collection,
    focusFirst: () => focus(first()),
    focusLast: () => focus(last()),
    isFirst: (element: EventTarget | null) =>
      element === body.value?.querySelector(`[data-index="${first()}"] [role="treeitem"]`),
  }
}
