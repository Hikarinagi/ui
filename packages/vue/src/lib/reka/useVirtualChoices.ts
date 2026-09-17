import { computed, nextTick, onScopeDispose, shallowRef, useId, watch } from 'vue'
import { useEventListener } from '@vueuse/core'
import {
  injectComboboxRootContext,
  injectListboxRootContext,
  injectSelectRootContext,
  useFilter,
} from 'reka-ui'
import type ScrollArea from '../../components/scroll-area/ScrollArea.vue'
import { isOptionGroup, type SelectItems, type SelectOption } from '../../components/select/types'
import { useVirtualCollection } from '../virtual/useVirtualCollection'
import { nextEnabled, typeaheadMatch } from '../virtual/navigation'
import type { VirtualizeOptions } from '../virtual/types'

interface ChoiceRow<T> {
  key: string
  label: string
  option?: T
  group?: number
  position: number
}

export function useVirtualChoices<T extends SelectOption>(props: {
  options: SelectItems<T>
  kind: 'select' | 'combobox' | 'listbox'
  virtualize?: VirtualizeOptions
  input?: HTMLElement
}) {
  const select = props.kind === 'select' ? injectSelectRootContext() : undefined
  const listbox = props.kind !== 'select' ? injectListboxRootContext() : undefined
  const combobox = props.kind === 'combobox' ? injectComboboxRootContext() : undefined
  const area = shallowRef<InstanceType<typeof ScrollArea>>()
  const body = shallowRef<HTMLElement>()
  const viewport = computed(() => area.value?.viewport)
  const activeKey = shallowRef<string>()
  const id = useId()
  const { contains } = useFilter({ sensitivity: 'base' })
  const rows = computed(() => {
    const result: ChoiceRow<T>[] = []
    const query = combobox && !combobox.ignoreFilter.value ? combobox.filterSearch.value : ''
    let position = 0
    props.options.forEach((item, groupIndex) => {
      if (isOptionGroup(item)) {
        const options = item.options.filter(option => !query || contains(option.label, query))
        if (!options.length) return
        const group = result.length
        result.push({ key: `group:${groupIndex}`, label: item.label, position: 0 })
        for (const option of options)
          result.push({
            key: `option:${typeof option.value}:${option.value}`,
            label: option.label,
            option,
            group,
            position: ++position,
          })
      } else if (!query || contains(item.label, query))
        result.push({
          key: `option:${typeof item.value}:${item.value}`,
          label: item.label,
          option: item,
          position: ++position,
        })
    })
    return result
  })
  const size = computed(() => rows.value.filter(row => row.option).length)
  const disabled = (index: number) =>
    !rows.value[index]?.option || !!rows.value[index]?.option?.disabled
  const first = () => nextEnabled(rows.value.length, 0, 1, disabled)
  const selectedIndex = computed(() => {
    const model = select?.modelValue.value ?? listbox?.modelValue.value
    const value = Array.isArray(model) ? model[0] : model
    return rows.value.findIndex(row => row.option?.value === value && !!row.option)
  })
  const activeIndex = computed(() => rows.value.findIndex(row => row.key === activeKey.value))
  const collection = useVirtualCollection({
    items: () => rows.value,
    key: row => row.key,
    viewport,
    body,
    config: () => props.virtualize,
    retain: () => [activeIndex.value, selectedIndex.value],
    include: indexes =>
      indexes.flatMap(index =>
        rows.value[index]?.group === undefined ? [] : [rows.value[index]!.group!],
      ),
    estimate: row => (row.option ? (row.option.description ? 54 : 36) : 30),
  })
  let generation = 0
  let disposed = false
  async function highlight(index: number, scroll = true, focus = listbox?.focusable.value ?? true) {
    if (index < 0 || disabled(index)) return
    const version = ++generation
    const key = rows.value[index]!.key
    activeKey.value = key
    await nextTick()
    if (disposed || version !== generation || rows.value[index]?.key !== key) return
    if (scroll) collection.virtualizer.value.scrollToIndex(index, { align: 'auto' })
    const element = body.value?.querySelector<HTMLElement>(
      `[data-index="${index}"] [role="option"]`,
    )
    if (!element) return
    if (listbox) listbox.changeHighlight(element, false, false)
    if (focus) element.focus({ preventScroll: true })
    return element
  }
  function remember(event: Event) {
    const wrapper = (event.target as Element).closest<HTMLElement>('[data-index]')
    if (wrapper && body.value?.contains(wrapper))
      activeKey.value = rows.value[Number(wrapper.dataset.index)]?.key
  }
  let search = ''
  let searchedAt = 0
  function keydown(event: KeyboardEvent) {
    if (
      event.isComposing ||
      event.defaultPrevented ||
      select?.disabled?.value ||
      listbox?.disabled.value
    )
      return
    const input =
      event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement
    const meta = event.ctrlKey || event.metaKey || event.altKey
    const current = activeIndex.value
    if (Date.now() - searchedAt > 1000) search = ''
    let target = -1
    if (
      (event.ctrlKey || event.metaKey) &&
      !event.altKey &&
      event.key.toLowerCase() === 'a' &&
      !input &&
      listbox?.multiple.value
    ) {
      event.preventDefault()
      event.stopImmediatePropagation()
      listbox.modelValue.value = rows.value.flatMap(row =>
        row.option && !row.option.disabled ? [row.option.value] : [],
      )
      return
    }
    if (meta) return
    if (event.key === 'ArrowDown') target = nextEnabled(rows.value.length, current + 1, 1, disabled)
    else if (event.key === 'ArrowUp')
      target = nextEnabled(
        rows.value.length,
        current < 0 ? rows.value.length - 1 : current - 1,
        -1,
        disabled,
      )
    else if (event.key === 'Home') target = first()
    else if (event.key === 'End')
      target = nextEnabled(rows.value.length, rows.value.length - 1, -1, disabled)
    else if (event.key === 'PageDown' || event.key === 'PageUp') {
      const step = event.key === 'PageDown' ? 1 : -1
      target = nextEnabled(
        rows.value.length,
        Math.max(
          0,
          Math.min(
            rows.value.length - 1,
            Math.max(0, current) +
              step * Math.max(1, Math.floor((viewport.value?.clientHeight ?? 320) / 36)),
          ),
        ),
        step,
        disabled,
      )
    } else if (event.key === 'Enter' || (event.key === ' ' && !input && !search)) {
      if (current < 0 || disabled(current)) return
      event.preventDefault()
      event.stopImmediatePropagation()
      if (select) {
        select.onValueChange(rows.value[current]!.option!.value)
        if (!select.multiple.value) select.onOpenChange(false)
      } else {
        void highlight(current, false, false).then(element => element?.click())
      }
      return
    } else if (!input && event.key.length === 1) {
      const now = Date.now()
      search = (now - searchedAt > 1000 ? '' : search) + event.key
      searchedAt = now
      target = typeaheadMatch(
        rows.value.map(row => row.label),
        search,
        current,
        disabled,
      )
    } else return
    event.preventDefault()
    event.stopImmediatePropagation()
    if (target < 0) return
    if (
      event.shiftKey &&
      listbox?.multiple.value &&
      listbox.selectionBehavior?.value === 'replace'
    ) {
      const start = rows.value.findIndex(row => row.option?.value === listbox.firstValue?.value)
      if (start >= 0)
        listbox.modelValue.value = rows.value
          .slice(Math.min(start, target), Math.max(start, target) + 1)
          .flatMap(row => (row.option && !row.option.disabled ? [row.option.value] : []))
    }
    void highlight(target)
  }
  useEventListener(body, 'keydown', keydown, { capture: true })
  useEventListener(() => combobox?.inputElement.value ?? props.input, 'keydown', keydown, {
    capture: true,
  })
  useEventListener(body, 'focusin', remember)
  const stops: Array<() => void> = []
  if (listbox) {
    const previous = listbox.isVirtual.value
    listbox.isVirtual.value = true
    stops.push(() => {
      listbox.isVirtual.value = previous
    })
    stops.push(
      listbox.virtualFocusHook.on(({ event, scroll }) => {
        event?.preventDefault()
        void highlight(
          selectedIndex.value >= 0 ? selectedIndex.value : first(),
          scroll,
          event ? true : scroll && listbox.focusable.value,
        )
      }).off,
    )
    stops.push(
      listbox.virtualHighlightHook.on(value => {
        void highlight(rows.value.findIndex(row => row.option?.value === value))
      }).off,
    )
    stops.push(
      listbox.virtualKeydownHook.on(event => {
        if (event.key === 'PageUp' && !event.target) void highlight(first(), true, false)
      }).off,
    )
    watch(listbox.highlightedElement, element => {
      const index = Number(element?.closest<HTMLElement>('[data-index]')?.dataset.index)
      if (Number.isFinite(index) && rows.value[index]) activeKey.value = rows.value[index]!.key
    })
  }
  if (combobox) {
    const previous = combobox.isVirtual.value
    combobox.isVirtual.value = true
    stops.push(() => {
      combobox.isVirtual.value = previous
    })
  }
  watch(
    rows,
    () => {
      if (activeIndex.value < 0)
        void highlight(selectedIndex.value >= 0 ? selectedIndex.value : first(), false, false)
      if (!rows.value.length && listbox) listbox.highlightedElement.value = null
    },
    { immediate: true, flush: 'post' },
  )
  watch(
    viewport,
    (element, previous) => {
      if (element && props.kind !== 'listbox') element.setAttribute('role', 'group')
      if (element && !previous)
        void highlight(
          selectedIndex.value >= 0 ? selectedIndex.value : first(),
          selectedIndex.value >= 0,
          !!select?.open.value,
        )
    },
    { flush: 'post' },
  )
  onScopeDispose(() => {
    disposed = true
    generation++
    stops.forEach(stop => stop())
  })
  function itemAttrs(index: number) {
    const row = rows.value[index]!
    return {
      'aria-posinset': row.position,
      'aria-setsize': size.value,
      'aria-describedby': row.group === undefined ? undefined : `${id}-${row.group}`,
    }
  }
  return {
    area,
    body,
    viewport,
    rows,
    ...collection,
    itemAttrs,
    labelId: (index: number) => `${id}-${index}`,
  }
}
