import { computed, nextTick, onScopeDispose, shallowRef, watch, type Ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { injectTreeRootContext, type FlattenedItem } from 'reka-ui'
import { useVirtualCollection } from '../virtual/useVirtualCollection'
import { nextEnabled, typeaheadMatch } from '../virtual/navigation'
import type { VirtualizeOptions } from '../virtual/types'

export function useVirtualTree<T extends { label: string; disabled?: boolean }>(
  props: {
    items: FlattenedItem<T>[]
    virtualize?: VirtualizeOptions
    disabled?: (node: T) => boolean
  },
  viewport: Ref<HTMLElement | undefined>,
) {
  const root = injectTreeRootContext()
  const body = shallowRef<HTMLElement>()
  const active = shallowRef<string>()
  const index = computed(() => props.items.findIndex(item => item._id === active.value))
  const disabled = (i: number) =>
    !props.items[i] ||
    root.disabled.value ||
    (props.disabled?.(props.items[i]!.value) ?? !!props.items[i]!.value.disabled)
  const selected = computed(() =>
    props.items.findIndex(item => root.selectedKeys.value.includes(item._id)),
  )
  const collection = useVirtualCollection({
    items: () => props.items,
    key: item => item._id,
    config: () => props.virtualize,
    viewport,
    body,
    retain: () => [index.value, selected.value],
  })
  const previous = root.isVirtual.value
  root.isVirtual.value = true
  let generation = 0
  let disposed = false
  async function focus(target: number, moveFocus = true) {
    if (target < 0 || disabled(target)) return
    const version = ++generation
    const key = props.items[target]!._id
    active.value = key
    await nextTick()
    if (disposed || generation !== version || props.items[target]?._id !== key) return
    collection.virtualizer.value.scrollToIndex(target, { align: 'auto' })
    if (moveFocus)
      body.value
        ?.querySelector<HTMLElement>(`[data-index="${target}"] [role="treeitem"]`)
        ?.focus({ preventScroll: true })
  }
  const first = () => nextEnabled(props.items.length, 0, 1, disabled)
  const last = () => nextEnabled(props.items.length, props.items.length - 1, -1, disabled)
  let search = ''
  let searchedAt = 0
  function keydown(event: KeyboardEvent) {
    if (
      event.defaultPrevented ||
      event.isComposing ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      root.disabled.value
    )
      return
    const current = index.value
    const item = props.items[current]
    let target = -1
    if (event.key === 'ArrowDown')
      target = nextEnabled(props.items.length, current + 1, 1, disabled)
    else if (event.key === 'ArrowUp')
      target = nextEnabled(props.items.length, current - 1, -1, disabled)
    else if (event.key === 'Home') target = first()
    else if (event.key === 'End') target = last()
    else if (event.key === 'PageDown' || event.key === 'PageUp') {
      const step = event.key === 'PageDown' ? 1 : -1
      target = nextEnabled(
        props.items.length,
        Math.max(
          0,
          Math.min(
            props.items.length - 1,
            current + step * Math.max(1, Math.floor((viewport.value?.clientHeight ?? 320) / 36)),
          ),
        ),
        step,
        disabled,
      )
    } else if (event.key === (root.dir.value === 'rtl' ? 'ArrowLeft' : 'ArrowRight')) {
      if (!item?.hasChildren) return
      if (!root.expanded.value.includes(item._id)) return
      const child = nextEnabled(props.items.length, current + 1, 1, disabled)
      if (props.items[child]?.level === item.level + 1) target = child
    } else if (event.key === (root.dir.value === 'rtl' ? 'ArrowRight' : 'ArrowLeft')) {
      if (!item || root.expanded.value.includes(item._id)) return
      if (item.parentItem)
        target = props.items.findIndex(row => row._id === root.getKey(item.parentItem))
    } else if (event.key.length === 1 && event.key !== ' ') {
      const now = Date.now()
      search = (now - searchedAt > 1000 ? '' : search) + event.key
      searchedAt = now
      target = typeaheadMatch(
        props.items.map(row => row.value.label),
        search,
        current,
        disabled,
      )
    } else return
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
      let removed = old?.find(item => item._id === active.value)
      let target = -1
      while (removed?.parentItem && target < 0) {
        const parent = root.getKey(removed.parentItem)
        target = items.findIndex(item => item._id === parent)
        removed = old?.find(item => item._id === parent)
      }
      void focus(target >= 0 ? target : first(), body.value?.contains(document.activeElement))
    },
    { flush: 'pre' },
  )
  watch(
    viewport,
    (element, previous) => {
      if (element && !previous) void focus(selected.value >= 0 ? selected.value : first(), false)
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
