'use client'

import { useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { focusFieldFrom } from '../../../../../shared/src/lib/field-focus'
import type { SelectItems, SelectOption } from '../../select/types'
import { useOptionLabels } from '../../combobox/hooks/useOptionLabels'

interface MultiComboboxOptions<T extends SelectOption> {
  options: SelectItems<T>
  selectedOptions: readonly T[] | undefined
  model: Array<string | number>
  setModel: (value: Array<string | number>) => void
  open: boolean
  setOpen: (open: boolean) => void
  disabled: boolean
  onClear: () => void
}

export function useMultiCombobox<T extends SelectOption>(options: MultiComboboxOptions<T>) {
  const { model, setModel, open } = options
  const [keyboard, setKeyboard] = useState(false)
  const input = useRef<HTMLInputElement | null>(null)
  const labels = useOptionLabels(options.options, options.selectedOptions)

  const selected = model.map(value => ({ value, label: labels.get(value) ?? String(value) }))

  const [previousOpen, setPreviousOpen] = useState(open)
  let keyboardNow = keyboard
  if (previousOpen !== open) {
    setPreviousOpen(open)
    if (!open && keyboard) {
      setKeyboard(false)
      keyboardNow = false
    }
  }

  function remove(value: string | number) {
    if (options.disabled) return
    setModel(model.filter(item => item !== value))
  }

  function clear() {
    if (!model.length) return
    setModel([])
    options.onClear()
    input.current?.focus()
  }

  function onHostClick(event: MouseEvent<HTMLElement>) {
    const focused = focusFieldFrom(event.currentTarget, event.target as HTMLElement)
    if (focused && !open) options.setOpen(true)
  }

  function onInputKeydown(event: KeyboardEvent<HTMLInputElement>) {
    setKeyboard(true)
    if (
      event.key !== 'Backspace' ||
      (event.target as HTMLInputElement).value !== '' ||
      !model.length
    )
      return
    setModel(model.slice(0, -1))
  }

  return { selected, keyboard: keyboardNow, input, remove, clear, onHostClick, onInputKeydown }
}
