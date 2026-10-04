'use client'

import {
  useEffect,
  useId,
  useReducer,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { applyCompletion } from '../../../../../shared/src/lib/completion'
import { useRenderTick } from '../../../lib/virtual/useRenderTick'
import type { ScrollAreaHandle } from '../../scroll-area/ScrollArea'
import type {
  AutocompleteOption,
  AutocompleteSelection,
  CompletionContext,
  CompletionEdit,
} from '../types'

type Value = string | number

export function useAutocomplete<T extends AutocompleteOption>(config: {
  options: readonly T[]
  model: string
  setModel: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  disabled: boolean
  readonly: boolean | undefined
  selectOnTab: boolean | undefined
  getCompletion: ((option: T, context: CompletionContext) => CompletionEdit) | undefined
  onQuery: (context: CompletionContext) => void
  onSelect: (selection: AutocompleteSelection<T>) => void
  onSubmit: (text: string) => void
  onClear: () => void
}) {
  const input = useRef<HTMLInputElement | null>(null)
  const [host, setHost] = useState<HTMLElement | null>(null)
  const scroll = useRef<ScrollAreaHandle | null>(null)
  const tick = useRenderTick()
  const [, rerender] = useReducer((count: number) => count + 1, 0)
  const listId = `hn-autocomplete-${useId()}`
  const blocked = config.disabled || !!config.readonly
  const state = useRef({
    active: undefined as Value | undefined,
    composing: false,
    lastQuery: '',
    revision: 0,
    restoringFocus: false,
    open: config.open,
    model: config.model,
    options: config.options,
    blocked,
  })
  const self = state.current
  self.open = config.open
  self.model = config.model
  const latest = useRef(config)
  latest.current = config

  if (self.options !== config.options) {
    self.options = config.options
    self.active = undefined
  }
  const visible = config.open && !blocked
  if (!visible) self.active = undefined
  const activeIndexOf = () =>
    self.options.findIndex(option => option.value === self.active && !option.disabled)
  if (activeIndexOf() < 0) self.active = undefined
  const isVisible = () => self.open && !self.blocked
  self.blocked = blocked

  const optionId = (index: number) => `${listId}-${index}`
  const activeIndex = activeIndexOf()
  const activeId = visible && activeIndex >= 0 ? optionId(activeIndex) : undefined

  function setVisible(value: boolean) {
    self.open = value
    latest.current.setOpen(value)
  }

  function setActive(value: Value | undefined) {
    self.active = value
    rerender()
  }

  function setModel(value: string) {
    self.model = value
    latest.current.setModel(value)
  }

  function context(): CompletionContext {
    const text = input.current?.value ?? self.model
    return {
      text,
      selectionStart: input.current?.selectionStart ?? text.length,
      selectionEnd: input.current?.selectionEnd ?? text.length,
    }
  }

  function query(force = false) {
    if (self.blocked || self.composing) return false
    const value = context()
    const signature = JSON.stringify(value)
    if (!force && signature === self.lastQuery) return false
    self.lastQuery = signature
    setActive(undefined)
    latest.current.onQuery(value)
    return true
  }

  function show() {
    if (self.blocked || self.composing || self.restoringFocus) return
    const reopening = !isVisible()
    setVisible(true)
    query(reopening)
  }

  function onInput() {
    self.revision++
    setModel(input.current?.value ?? '')
    setActive(undefined)
    if (self.composing) return
    setVisible(true)
    query()
  }

  function onCompositionStart() {
    self.composing = true
  }

  function onCompositionEnd() {
    self.composing = false
    onInput()
  }

  function onBlur() {
    self.revision++
    setVisible(false)
  }

  useEffect(() => {
    const document = input.current?.ownerDocument
    if (!document) return
    const listener = () => {
      if (input.current?.ownerDocument.activeElement !== input.current || self.composing) return
      if (query()) setVisible(true)
    }
    document.addEventListener('selectionchange', listener)
    return () => document.removeEventListener('selectionchange', listener)
  }, [])

  async function select(option: T) {
    if (self.blocked || self.composing || !isVisible() || option.disabled) return
    const before = context()
    const edit = latest.current.getCompletion?.(option, before) ?? {
      range: [0, before.text.length] as [number, number],
      text: option.label,
    }
    const after = applyCompletion(before, edit)
    const current = ++self.revision
    setModel(after.text)
    setActive(undefined)
    setVisible(!!edit.keepOpen)
    self.lastQuery = JSON.stringify(after)
    latest.current.onSelect({ option, context: before, edit })
    await tick()
    const element = input.current
    if (current !== self.revision || !element || self.blocked || element.value !== after.text)
      return
    self.restoringFocus = true
    element.focus({ preventScroll: true })
    self.restoringFocus = false
    element.setSelectionRange(after.selectionStart, after.selectionEnd)
    query(true)
  }

  async function move(direction: number) {
    setVisible(true)
    await tick()
    if (!isVisible() || self.blocked) return
    const options = self.options
    let index = activeIndexOf()
    if (index < 0) index = direction > 0 ? -1 : options.length
    for (let step = 0; step < options.length; step++) {
      index = (index + direction + options.length) % options.length
      if (!options[index]!.disabled) {
        setActive(options[index]!.value)
        break
      }
    }
    await tick()
    const currentIndex = activeIndexOf()
    const id = isVisible() && currentIndex >= 0 ? optionId(currentIndex) : undefined
    const row = id ? input.current?.ownerDocument.getElementById(id) : null
    const viewport = scroll.current?.viewport
    if (!row || !viewport) return
    const bounds = row.getBoundingClientRect()
    const frame = viewport.getBoundingClientRect()
    if (bounds.top < frame.top) viewport.scrollTop -= frame.top - bounds.top
    else if (bounds.bottom > frame.bottom) viewport.scrollTop += bounds.bottom - frame.bottom
  }

  function ignored(event: KeyboardEvent) {
    return (
      self.blocked ||
      self.composing ||
      event.isComposing ||
      event.keyCode === 229 ||
      event.defaultPrevented ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    )
  }

  function escape(event: KeyboardEvent) {
    if (ignored(event)) return
    if (!isVisible() && !self.model) return
    event.preventDefault()
    event.stopPropagation()
    if (isVisible()) setVisible(false)
    else {
      setModel('')
      self.lastQuery = JSON.stringify({ text: '', selectionStart: 0, selectionEnd: 0 })
      latest.current.onClear()
      latest.current.onQuery({ text: '', selectionStart: 0, selectionEnd: 0 })
    }
  }

  useEffect(() => {
    const view = input.current?.ownerDocument.defaultView
    if (!view) return
    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && event.target === input.current) escape(event)
    }
    view.addEventListener('keydown', listener, { capture: true })
    return () => view.removeEventListener('keydown', listener, { capture: true })
  }, [])

  function onKeydown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (ignored(event.nativeEvent)) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!isVisible()) query(true)
      void move(event.key === 'ArrowDown' ? 1 : -1)
    } else if (
      event.key === 'Enter' ||
      (event.key === 'Tab' && !event.shiftKey && latest.current.selectOnTab)
    ) {
      const option = isVisible() ? self.options[activeIndexOf()] : undefined
      if (option) {
        event.preventDefault()
        void select(option)
      } else if (event.key === 'Enter') {
        event.preventDefault()
        setVisible(false)
        latest.current.onSubmit(self.model)
      }
    }
  }

  function highlight(option: T, event: { pointerType: string }) {
    if (event.pointerType === 'touch' || !isVisible() || option.disabled) return
    setActive(option.value)
  }

  const wasBlocked = useRef(blocked)
  useEffect(() => {
    if (wasBlocked.current === blocked) return
    wasBlocked.current = blocked
    if (blocked) setVisible(false)
  }, [blocked])

  return {
    input,
    host,
    setHost,
    scroll,
    listId,
    optionId,
    active: self.active,
    activeId,
    visible,
    setVisible,
    show,
    onInput,
    onBlur,
    onCompositionStart,
    onCompositionEnd,
    onKeydown,
    select,
    highlight,
  }
}
