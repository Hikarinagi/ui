'use client'

import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react'
import { focusFieldFrom } from '../../../../../shared/src/lib/field-focus'
import type { SelectItems, SelectOption } from '../../select/types'
import { useOptionLabels } from './useOptionLabels'

export type ComboboxValue = string | number | null | undefined

interface ComboboxOptions<T extends SelectOption> {
  options: SelectItems<T>
  selectedOption: T | null | undefined
  model: ComboboxValue
  setModel: (value: ComboboxValue) => void
  search: string
  setSearch: (value: string) => void
  open: boolean
  disabled: boolean
  onClear: () => void
}

export function useCombobox<T extends SelectOption>(options: ComboboxOptions<T>) {
  const { model, setModel, search, setSearch, open } = options
  const labels = useOptionLabels(
    options.options,
    options.selectedOption ? [options.selectedOption] : [],
  )
  const [editing, setEditing] = useState(false)
  const [keyboard, setKeyboard] = useState(false)
  const input = useRef<HTMLInputElement | null>(null)

  const [previousModel, setPreviousModel] = useState(model)
  let editingNow = editing
  if (!Object.is(previousModel, model)) {
    setPreviousModel(model)
    if (editing) setEditing(false)
    editingNow = false
  }
  const [previousOpen, setPreviousOpen] = useState(open)
  let keyboardNow = keyboard
  if (previousOpen !== open) {
    setPreviousOpen(open)
    if (!open) {
      if (keyboard) setKeyboard(false)
      if (editing) setEditing(false)
      keyboardNow = false
      editingNow = false
    }
  }

  function displayValue(value: unknown) {
    return value == null ? '' : (labels.get(value as string | number) ?? '')
  }

  const label = displayValue(model)
  const inputValue = search || (editingNow ? '' : label)

  const previousLabel = useRef(label)
  useEffect(() => {
    if (previousLabel.current === label) return
    previousLabel.current = label
    if (!editingNow) setSearch(label)
  })

  function clear() {
    setModel(null)
    setSearch('')
    options.onClear()
    input.current?.focus()
  }

  function onInput(event: FormEvent<HTMLInputElement>) {
    if (options.disabled) return
    setEditing(true)
    if ((event.nativeEvent as InputEvent).isComposing) return
    if ((event.target as HTMLInputElement).value === '' && model != null) setModel(null)
  }

  function onHostClick(event: MouseEvent<HTMLElement>) {
    focusFieldFrom(event.currentTarget, event.target as HTMLElement)
  }

  return {
    keyboard: keyboardNow,
    setKeyboard,
    input,
    inputValue,
    displayValue,
    clear,
    onInput,
    onHostClick,
  }
}
