export interface PinRange {
  start: number
  end: number
}

export interface PinInputSelection extends PinRange {
  focused: boolean
}

export interface PinEdit extends PinRange {
  value: string
}

export interface PinCell {
  char: string
  active: boolean
  caret: boolean
}

export interface PinInputOptions {
  length: () => number
  numeric: () => boolean
  value: () => string
  rtl: () => boolean
  cells: () => ArrayLike<Element>
  change: (value: string) => void
  select: (selection: PinInputSelection) => void
}

export interface PinInputController {
  sync: () => void
  dispose: () => void
}

const FULL_WIDTH = /[！-～]/g
const UNSUPPORTED = /[\s\p{C}]|[\u{10000}-\u{10FFFF}]/gu
const NON_DIGIT = /\D/g
const IDLE: PinInputSelection = { focused: false, start: 0, end: 0 }

export function cleanPinText(text: string, numeric: boolean) {
  const folded = text.replace(FULL_WIDTH, character =>
    String.fromCharCode(character.charCodeAt(0) - 0xfee0),
  )
  return folded.replace(numeric ? NON_DIGIT : UNSUPPORTED, '')
}

export function pinInputValue(value: string, length: number) {
  return value.slice(0, Math.max(0, length))
}

export function pinSelectionAt(
  caret: number,
  size: number,
  length: number,
  backward = false,
): [number, number] {
  if (caret >= size) return size < length || !size ? [size, size] : [size - 1, size]
  if (backward && caret > 0) return [caret - 1, caret]
  return [caret, caret + 1]
}

export function editPinValue(
  base: string,
  raw: string,
  selection: PinRange | null,
  length: number,
  numeric: boolean,
  type = '',
): PinEdit {
  const limit = Math.min(base.length, raw.length)
  let prefix = 0
  while (prefix < limit && base[prefix] === raw[prefix]) prefix++
  if (selection) prefix = Math.min(prefix, selection.start)
  let suffix = 0
  while (suffix < limit - prefix && base[base.length - 1 - suffix] === raw[raw.length - 1 - suffix])
    suffix++
  if (selection) suffix = Math.max(0, Math.min(suffix, base.length - selection.end))
  const inserted = raw.slice(prefix, raw.length - suffix)
  const removed = base.length - suffix - prefix
  const kept = cleanPinText(inserted, numeric)
  if (inserted && !kept)
    return {
      value: base,
      start: selection?.start ?? prefix,
      end: selection?.end ?? prefix + removed,
    }
  const value =
    kept.length >= length
      ? kept.slice(0, length)
      : (base.slice(0, prefix) + kept + base.slice(prefix + Math.max(removed, kept.length))).slice(
          0,
          length,
        )
  const caret = kept.length >= length ? length : prefix + kept.length
  const [start, end] = pinSelectionAt(
    caret,
    value.length,
    length,
    !kept && type.includes('Backward'),
  )
  return { value, start, end }
}

export function movePinSelection(
  selection: PinRange,
  backward: boolean,
  size: number,
  length: number,
  target: number | 'previous' | 'next',
  extend: boolean,
): PinRange & { backward: boolean } {
  const last = Math.max(0, Math.min(size, length - 1))
  const collapsed = selection.start === selection.end
  const focus = collapsed || backward ? selection.start : selection.end - 1
  const anchor = collapsed ? selection.start : backward ? selection.end - 1 : selection.start
  const wide = selection.end - selection.start > 1
  const stepped =
    target === 'previous'
      ? wide && !extend
        ? selection.start
        : focus - 1
      : target === 'next'
        ? wide && !extend
          ? selection.end
          : focus + 1
        : target
  const next = Math.max(0, Math.min(stepped, last))
  if (!extend) {
    const [start, end] = pinSelectionAt(next, size, length)
    return { start, end, backward: false }
  }
  const start = Math.min(anchor, next)
  const end = Math.min(Math.max(anchor, next) + 1, size)
  return { start: Math.min(start, end), end, backward: next < anchor }
}

export function pinCells(value: string, length: number, selection: PinInputSelection): PinCell[] {
  const collapsed = selection.start === selection.end
  return Array.from({ length: Math.max(0, length) }, (_, index) => {
    const char = value[index] ?? ''
    const active =
      selection.focused &&
      (collapsed ? index === selection.start : index >= selection.start && index < selection.end)
    return { char, active, caret: active && !char }
  })
}

export function pinCellAt(cells: ArrayLike<Element>, x: number) {
  let nearest = 0
  let distance = Infinity
  for (let index = 0; index < cells.length; index++) {
    const rect = cells[index]!.getBoundingClientRect()
    const gap = x < rect.left ? rect.left - x : x > rect.right ? x - rect.right : 0
    if (gap < distance) {
      distance = gap
      nearest = index
    }
  }
  return nearest
}

function activeElement(document: Document) {
  let active = document.activeElement
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement
  return active
}

export function createPinInput(
  input: HTMLInputElement,
  options: PinInputOptions,
): PinInputController {
  const document = input.ownerDocument
  const shown = () => pinInputValue(options.value(), options.length())
  let text = shown()
  let base: string | null = null
  let anchor: PinRange | null = null
  let live: PinEdit | null = null
  let composing = false
  let pointer = 'mouse'
  let pressed = false
  let away = false
  let landing = false
  let disposed = false
  let view = IDLE

  const focused = () => activeElement(document) === input

  function range(): PinRange {
    const start = Math.min(input.selectionStart ?? text.length, text.length)
    return { start, end: Math.max(start, Math.min(input.selectionEnd ?? start, text.length)) }
  }

  function publish() {
    const next = !focused()
      ? IDLE
      : { focused: true, ...(composing && live ? { start: live.start, end: live.end } : range()) }
    if (next.focused === view.focused && next.start === view.start && next.end === view.end) return
    view = next
    options.select(next)
  }

  function place(start: number, end: number, backward = false) {
    if (!focused()) return
    if (input.selectionStart === start && input.selectionEnd === end) return
    input.setSelectionRange(start, end, backward ? 'backward' : 'forward')
  }

  function settle() {
    const { start, end } = range()
    if (start !== end) return
    const [from, to] = pinSelectionAt(start, text.length, options.length())
    place(from, to)
  }

  function emit(value: string) {
    if (value === text) return
    text = value
    options.change(value)
    queueMicrotask(sync)
  }

  function sync() {
    if (disposed) return
    const next = shown()
    if (next !== text) {
      text = next
      composing = false
      base = anchor = live = null
    } else if (composing || input.value === text) return
    if (input.value !== text) {
      const caret = Math.min(input.selectionStart ?? text.length, text.length)
      input.value = text
      const [start, end] = pinSelectionAt(caret, text.length, options.length())
      place(start, end)
    }
    publish()
  }

  function derive(type: string): PinEdit {
    const length = options.length()
    const numeric = options.numeric()
    if (type.startsWith('history')) {
      const value = cleanPinText(input.value, numeric).slice(0, length)
      const caret = Math.min(input.selectionStart ?? value.length, value.length)
      const [start, end] = pinSelectionAt(caret, value.length, length)
      return { value, start, end }
    }
    return editPinValue(base ?? text, input.value, anchor, length, numeric, type)
  }

  function preview(type: string) {
    composing = true
    base ??= text
    live = derive(type)
    emit(live.value)
    publish()
  }

  function commit(type: string) {
    const edit = derive(type)
    composing = false
    base = anchor = live = null
    if (input.value !== edit.value) input.value = edit.value
    emit(edit.value)
    place(edit.start, edit.end, type.includes('Backward'))
    publish()
  }

  function onBeforeInput(event: InputEvent) {
    landing = false
    if (composing || event.isComposing) return
    if (
      event.inputType === 'insertText' &&
      event.data &&
      !cleanPinText(event.data, options.numeric())
    ) {
      event.preventDefault()
      return
    }
    base = input.value
    anchor = range()
  }

  function onInput(event: Event) {
    const { inputType = '', isComposing } = event as InputEvent
    if (composing || isComposing) preview(inputType)
    else if (base !== null || input.value !== text) commit(inputType)
  }

  function onCompositionStart() {
    landing = false
    composing = true
    base = input.value
    anchor = range()
  }

  function onCompositionEnd() {
    if (composing) commit('insertCompositionText')
  }

  function land() {
    const size = text.length
    if (size && size >= options.length()) place(0, size)
    else place(size, size)
  }

  function onSelection() {
    if (composing) return
    if (focused()) {
      if (landing) land()
      else settle()
    }
    publish()
  }

  function onFocus() {
    landing = !pressed && !away && !composing
    if (landing) land()
    away = false
    publish()
  }

  function onBlur() {
    away = !document.hasFocus()
    pressed = false
    landing = false
    if (composing) commit('insertCompositionText')
    publish()
  }

  function onKeydown(event: KeyboardEvent) {
    landing = false
    if (composing || event.isComposing || event.keyCode === 229) return
    if (event.metaKey || event.ctrlKey || event.altKey) return
    const { key } = event
    const forward = options.rtl() ? 'ArrowLeft' : 'ArrowRight'
    const back = options.rtl() ? 'ArrowRight' : 'ArrowLeft'
    const target =
      key === forward
        ? 'next'
        : key === back
          ? 'previous'
          : key === 'Home'
            ? 0
            : key === 'End'
              ? options.length()
              : null
    if (target === null) return
    event.preventDefault()
    const next = movePinSelection(
      range(),
      input.selectionDirection === 'backward',
      text.length,
      options.length(),
      target,
      event.shiftKey,
    )
    place(next.start, next.end, next.backward)
    publish()
  }

  function pick(event: MouseEvent) {
    if (composing) return
    if (event.detail > 1 && text) place(0, text.length)
    else {
      const index = Math.min(pinCellAt(options.cells(), event.clientX), text.length)
      const [start, end] = pinSelectionAt(index, text.length, options.length())
      place(start, end)
    }
    publish()
  }

  function onPointerDown(event: PointerEvent) {
    landing = false
    pointer = event.pointerType
    pressed = pointer !== 'mouse'
  }

  function onMouseDown(event: MouseEvent) {
    if (event.button !== 0 || pointer !== 'mouse' || input.disabled) return
    event.preventDefault()
    pressed = true
    input.focus()
    pressed = false
    pick(event)
  }

  function onClick(event: MouseEvent) {
    const touched = pressed
    pressed = false
    if (touched && pointer !== 'mouse') pick(event)
  }

  const listeners: Array<[EventTarget, string, (event: never) => void]> = [
    [input, 'beforeinput', onBeforeInput],
    [input, 'input', onInput],
    [input, 'compositionstart', onCompositionStart],
    [input, 'compositionend', onCompositionEnd],
    [input, 'select', onSelection],
    [input, 'focus', onFocus],
    [input, 'blur', onBlur],
    [input, 'keydown', onKeydown],
    [input, 'pointerdown', onPointerDown],
    [input, 'mousedown', onMouseDown],
    [input, 'click', onClick],
    [document, 'selectionchange', onSelection],
  ]
  for (const [target, type, listener] of listeners)
    target.addEventListener(type, listener as EventListener)

  if (input.value !== text) input.value = text
  if (focused()) settle()
  publish()

  return {
    sync,
    dispose() {
      disposed = true
      for (const [target, type, listener] of listeners)
        target.removeEventListener(type, listener as EventListener)
    },
  }
}
