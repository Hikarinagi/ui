'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { ScrollAreaHandle } from '../../components/scroll-area/ScrollArea'
import { useOptionalListboxRootContext } from '../../primitives/listbox'
import { useOptionalSelectRootContext } from '../../primitives/select'
import type { SelectItems, SelectOption } from '../../../../shared/src/types/select'
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
import { createCollatorFilter } from '../../../../shared/src/lib/virtual/filter'
import { nextEnabled } from './navigation'
import type { VirtualizeOptions } from './types'
import { useRenderTick } from './useRenderTick'
import { useScrollAreaViewport } from './useScrollAreaViewport'
import { useVirtualCollection } from './useVirtualCollection'

export interface VirtualComboboxBridge {
  ignoreFilter: boolean
  filterSearch: string
  inputElement?: HTMLElement | null
  isVirtual: { current: boolean }
}

export type VirtualChoiceKind = 'select' | 'combobox' | 'listbox'

export interface VirtualChoicesOptions<T extends SelectOption> {
  options: SelectItems<T>
  kind: VirtualChoiceKind
  virtualize?: VirtualizeOptions
  input?: HTMLElement | null
  combobox?: VirtualComboboxBridge
}

export function useVirtualChoices<T extends SelectOption>(props: VirtualChoicesOptions<T>) {
  const selectContext = useOptionalSelectRootContext()
  const listboxContext = useOptionalListboxRootContext()
  const select = props.kind === 'select' ? selectContext : null
  const listbox = props.kind !== 'select' ? listboxContext : null
  const combobox = props.kind === 'combobox' ? props.combobox : undefined
  const area = useRef<ScrollAreaHandle>(null)
  const body = useRef<HTMLElement | null>(null)
  const viewport = useScrollAreaViewport(area)
  const activeKey = useRef<string | undefined>(undefined)
  const tick = useRenderTick()
  const id = useId()
  const [{ contains }] = useState(() => createCollatorFilter({ sensitivity: 'base' }))
  const query = combobox && !combobox.ignoreFilter ? combobox.filterSearch : ''
  const rows = useMemo(
    () => choiceRows(props.options, query, contains),
    [props.options, query, contains],
  )
  const size = choiceSize(rows)
  const disabled = (index: number) => choiceDisabled(rows, index)
  const first = () => nextEnabled(rows.length, 0, 1, disabled)
  const selectedIndex = selectedChoice(rows, select?.modelValue ?? listbox?.modelValue)
  const activeIndex = rows.findIndex(row => row.key === activeKey.current)
  const collection = useVirtualCollection({
    items: rows,
    key: row => row.key,
    viewport,
    body,
    config: props.virtualize,
    initialIndex: props.kind === 'listbox' ? undefined : selectedIndex,
    retain: [activeIndex, selectedIndex],
    include: indexes => choiceGroups(rows, indexes),
    estimate: choiceEstimate,
  })
  const latest = useRef({
    rows,
    select,
    listbox,
    combobox,
    viewport,
    selectedIndex,
    activeIndex,
    disabled,
    first,
  })
  latest.current = {
    rows,
    select,
    listbox,
    combobox,
    viewport,
    selectedIndex,
    activeIndex,
    disabled,
    first,
  }
  const generation = useRef(0)
  const disposed = useRef(false)
  const virtualizer = collection.virtualizer

  const highlight = useCallback(
    async (
      index: number,
      scroll = true,
      focus = latest.current.listbox?.getFocusable() ?? true,
      align: 'auto' | 'center' = 'auto',
    ) => {
      const { rows, disabled } = latest.current
      if (index < 0 || disabled(index)) return
      const version = ++generation.current
      const key = rows[index]!.key
      activeKey.current = key
      await tick()
      if (
        disposed.current ||
        version !== generation.current ||
        latest.current.rows[index]?.key !== key
      )
        return
      if (scroll) virtualizer.scrollToIndex(index, { align })
      const element = body.current?.querySelector<HTMLElement>(
        `[data-index="${index}"] [role="option"]`,
      )
      if (!element) return
      latest.current.listbox?.changeHighlight(element, false, false)
      if (focus) element.focus({ preventScroll: true })
      return element
    },
    [tick, virtualizer],
  )

  const [typeahead] = useState(() => createChoiceTypeahead())
  const keydown = useCallback(
    (event: KeyboardEvent) => {
      const { rows, select, listbox, viewport, activeIndex, disabled } = latest.current
      if (event.isComposing || event.defaultPrevented || select?.disabled || listbox?.disabled)
        return
      const action = choiceKeyAction(event, {
        labels: () => rows.map(row => row.label),
        count: rows.length,
        current: activeIndex,
        input:
          event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement,
        multiple: !!listbox?.multiple,
        page: viewport?.clientHeight ?? 320,
        disabled,
        typeahead,
      })
      if (action.type === 'none') return
      event.preventDefault()
      event.stopImmediatePropagation()
      if (action.type === 'select-all') {
        listbox!.setModelValue(enabledChoiceValues(rows))
        return
      }
      if (action.type === 'commit') {
        if (select) {
          select.onValueChange(rows[action.index]!.option!.value)
          if (!select.multiple) select.onOpenChange(false)
        } else {
          void highlight(action.index, false, false).then(element => element?.click())
        }
        return
      }
      if (action.target < 0) return
      if (event.shiftKey && listbox?.multiple && listbox.selectionBehavior === 'replace') {
        const values = choiceRangeValues(rows, listbox.firstValue.current, action.target)
        if (values) listbox.setModelValue(values)
      }
      void highlight(action.target)
    },
    [highlight, typeahead],
  )

  useEffect(() => {
    const element = body.current
    if (!element) return
    const remember = (event: Event) => {
      const wrapper = (event.target as Element).closest<HTMLElement>('[data-index]')
      if (wrapper && body.current?.contains(wrapper)) {
        activeKey.current = latest.current.rows[Number(wrapper.dataset.index)]?.key
        void tick()
      }
    }
    element.addEventListener('keydown', keydown, { capture: true })
    element.addEventListener('focusin', remember)
    return () => {
      element.removeEventListener('keydown', keydown, { capture: true })
      element.removeEventListener('focusin', remember)
    }
  }, [keydown, tick])

  const inputElement = combobox?.inputElement ?? props.input
  useEffect(() => {
    if (!inputElement) return
    inputElement.addEventListener('keydown', keydown, { capture: true })
    return () => inputElement.removeEventListener('keydown', keydown, { capture: true })
  }, [inputElement, keydown])

  useEffect(() => {
    disposed.current = false
    const stops: Array<() => void> = []
    const { listbox, combobox } = latest.current
    if (listbox) {
      const previous = listbox.isVirtual.current
      listbox.isVirtual.current = true
      stops.push(() => {
        listbox.isVirtual.current = previous
      })
      stops.push(
        listbox.virtualFocusHook.on(({ event, scroll }) => {
          event?.preventDefault()
          const { selectedIndex, first } = latest.current
          void highlight(
            selectedIndex >= 0 ? selectedIndex : first(),
            scroll,
            event ? true : scroll && listbox.getFocusable(),
            'center',
          )
        }).off,
      )
      stops.push(
        listbox.virtualHighlightHook.on(value => {
          void highlight(latest.current.rows.findIndex(row => row.option?.value === value))
        }).off,
      )
      stops.push(
        listbox.virtualKeydownHook.on(event => {
          if (event.key === 'PageUp' && !event.target)
            void highlight(latest.current.first(), true, false)
        }).off,
      )
    }
    if (combobox) {
      const previous = combobox.isVirtual.current
      combobox.isVirtual.current = true
      stops.push(() => {
        combobox.isVirtual.current = previous
      })
    }
    return () => {
      disposed.current = true
      generation.current++
      stops.forEach(stop => stop())
    }
  }, [highlight])

  const highlightedElement = listbox?.highlightedElement
  const firstHighlight = useRef(true)
  useEffect(() => {
    if (firstHighlight.current) {
      firstHighlight.current = false
      return
    }
    const index = Number(highlightedElement?.closest<HTMLElement>('[data-index]')?.dataset.index)
    if (Number.isFinite(index) && latest.current.rows[index]) {
      activeKey.current = latest.current.rows[index]!.key
      void tick()
    }
  }, [highlightedElement, tick])

  useEffect(() => {
    const { activeIndex, selectedIndex, first, listbox } = latest.current
    if (activeIndex < 0) void highlight(selectedIndex >= 0 ? selectedIndex : first(), false, false)
    if (!rows.length && listbox) listbox.setHighlightedElement(null)
  }, [rows, highlight])

  const previousViewport = useRef(viewport)
  useEffect(() => {
    if (previousViewport.current === viewport) return
    previousViewport.current = viewport
    const { selectedIndex, first, select } = latest.current
    if (viewport && props.kind !== 'listbox') viewport.setAttribute('role', 'group')
    if (viewport)
      void highlight(
        selectedIndex >= 0 ? selectedIndex : first(),
        selectedIndex >= 0,
        !!select?.getOpen(),
        'center',
      )
  }, [viewport, highlight, props.kind])

  return {
    area,
    body,
    viewport,
    rows,
    ...collection,
    itemAttrs: (index: number) => choiceAttrs(rows, index, size, id),
    labelId: (index: number) => `${id}-${index}`,
  }
}
