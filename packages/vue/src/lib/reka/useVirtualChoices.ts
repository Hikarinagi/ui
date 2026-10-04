import { computed, nextTick, onScopeDispose, shallowRef, useId, watch } from 'vue'
import { useEventListener } from '@vueuse/core'
import {
  injectComboboxRootContext,
  injectListboxRootContext,
  injectSelectRootContext,
  useFilter,
} from 'reka-ui'
import type ScrollArea from '../../components/scroll-area/ScrollArea.vue'
import type { SelectItems, SelectOption } from '../../components/select/types'
import { useVirtualCollection } from '../virtual/useVirtualCollection'
import { nextEnabled } from '../virtual/navigation'
import type { VirtualizeOptions } from '../virtual/types'
import {
  choiceAttrs,
  choiceDisabled,
  choiceEstimate,
  choiceGroups,
  choiceKeyAction,
  choiceRangeValues,
  choiceRows,
  choiceSize,
  createChoiceTypeahead,
  enabledChoiceValues,
  selectedChoice,
} from '../../../../shared/src/lib/virtual/choices'

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
  const rows = computed(() =>
    choiceRows(
      props.options,
      combobox && !combobox.ignoreFilter.value ? combobox.filterSearch.value : '',
      contains,
    ),
  )
  const size = computed(() => choiceSize(rows.value))
  const disabled = (index: number) => choiceDisabled(rows.value, index)
  const first = () => nextEnabled(rows.value.length, 0, 1, disabled)
  const selectedIndex = computed(() =>
    selectedChoice(rows.value, select?.modelValue.value ?? listbox?.modelValue.value),
  )
  const activeIndex = computed(() => rows.value.findIndex(row => row.key === activeKey.value))
  const collection = useVirtualCollection({
    items: () => rows.value,
    key: row => row.key,
    viewport,
    body,
    config: () => props.virtualize,
    initialIndex: props.kind === 'listbox' ? undefined : () => selectedIndex.value,
    retain: () => [activeIndex.value, selectedIndex.value],
    include: indexes => choiceGroups(rows.value, indexes),
    estimate: choiceEstimate,
  })
  let generation = 0
  let disposed = false
  async function highlight(
    index: number,
    scroll = true,
    focus = listbox?.focusable.value ?? true,
    align: 'auto' | 'center' = 'auto',
  ) {
    if (index < 0 || disabled(index)) return
    const version = ++generation
    const key = rows.value[index]!.key
    activeKey.value = key
    await nextTick()
    if (disposed || version !== generation || rows.value[index]?.key !== key) return
    if (scroll) collection.virtualizer.value.scrollToIndex(index, { align })
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
  const typeahead = createChoiceTypeahead()
  function keydown(event: KeyboardEvent) {
    if (
      event.isComposing ||
      event.defaultPrevented ||
      select?.disabled?.value ||
      listbox?.disabled.value
    )
      return
    const action = choiceKeyAction(event, {
      labels: () => rows.value.map(row => row.label),
      count: rows.value.length,
      current: activeIndex.value,
      input:
        event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement,
      multiple: !!listbox?.multiple.value,
      page: viewport.value?.clientHeight ?? 320,
      disabled,
      typeahead,
    })
    if (action.type === 'none') return
    event.preventDefault()
    event.stopImmediatePropagation()
    if (action.type === 'select-all') {
      listbox!.modelValue.value = enabledChoiceValues(rows.value)
      return
    }
    if (action.type === 'commit') {
      if (select) {
        select.onValueChange(rows.value[action.index]!.option!.value)
        if (!select.multiple.value) select.onOpenChange(false)
      } else {
        void highlight(action.index, false, false).then(element => element?.click())
      }
      return
    }
    if (action.target < 0) return
    if (
      event.shiftKey &&
      listbox?.multiple.value &&
      listbox.selectionBehavior?.value === 'replace'
    ) {
      const values = choiceRangeValues(rows.value, listbox.firstValue?.value, action.target)
      if (values) listbox.modelValue.value = values
    }
    void highlight(action.target)
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
          'center',
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
    element => {
      if (element && props.kind !== 'listbox') element.setAttribute('role', 'group')
      if (element)
        void highlight(
          selectedIndex.value >= 0 ? selectedIndex.value : first(),
          selectedIndex.value >= 0,
          !!select?.open.value,
          'center',
        )
    },
    { flush: 'post' },
  )
  onScopeDispose(() => {
    disposed = true
    generation++
    stops.forEach(stop => stop())
  })
  return {
    area,
    body,
    viewport,
    rows,
    ...collection,
    itemAttrs: (index: number) => choiceAttrs(rows.value, index, size.value, id),
    labelId: (index: number) => `${id}-${index}`,
  }
}
