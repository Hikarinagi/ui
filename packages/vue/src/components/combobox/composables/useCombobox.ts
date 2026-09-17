import { computed, ref, shallowRef, watch, type Ref } from 'vue'
import { focusFieldFrom } from '../../../lib/field-focus'
import type { SelectItems, SelectOption } from '../../select/types'
import { useOptionLabels } from './useOptionLabels'

interface ComboboxOptions<T extends SelectOption> {
  options: () => SelectItems<T>
  selectedOption: () => T | null | undefined
  model: Ref<string | number | null | undefined>
  search: Ref<string>
  open: Ref<boolean>
  disabled: () => boolean
  onClear: () => void
}

export function useCombobox<T extends SelectOption>(options: ComboboxOptions<T>) {
  const { model, search, open } = options
  const labels = useOptionLabels(options.options, () => {
    const option = options.selectedOption()
    return option ? [option] : []
  })
  const label = computed(() => displayValue(model.value))
  const editing = ref(false)
  const inputValue = computed({
    get: () => search.value || (editing.value ? '' : label.value),
    set: value => (search.value = value),
  })
  const keyboard = ref(false)
  const input = shallowRef<{ $el: HTMLInputElement } | null>(null)

  function displayValue(value: string | number | null | undefined) {
    return value == null ? '' : (labels.get(value) ?? '')
  }

  function clear() {
    model.value = null
    search.value = ''
    options.onClear()
    input.value?.$el.focus()
  }

  function onInput(event: Event) {
    if (options.disabled()) return
    editing.value = true
    if ((event as InputEvent).isComposing) return
    if ((event.target as HTMLInputElement).value === '' && model.value != null) model.value = null
  }

  function onHostClick(event: MouseEvent) {
    focusFieldFrom(event.currentTarget as HTMLElement, event.target as HTMLElement)
  }

  watch(open, value => {
    if (!value) {
      keyboard.value = false
      editing.value = false
    }
  })

  watch(model, () => (editing.value = false), { flush: 'sync' })

  watch(label, value => {
    if (!editing.value) search.value = value
  })

  return { keyboard, input, inputValue, displayValue, clear, onInput, onHostClick }
}
