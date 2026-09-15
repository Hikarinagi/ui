import { ref, shallowRef, watch, type Ref } from 'vue'
import { focusFieldFrom } from '../../../lib/field-focus'
import { flattenOptions, type SelectItems, type SelectOption } from '../../select/types'

interface ComboboxOptions<T extends SelectOption> {
  options: () => SelectItems<T>
  model: Ref<string | number | null | undefined>
  search: Ref<string>
  open: Ref<boolean>
  disabled: () => boolean
  onClear: () => void
}

export function useCombobox<T extends SelectOption>(options: ComboboxOptions<T>) {
  const { model, search, open } = options
  const keyboard = ref(false)
  const input = shallowRef<{ $el: HTMLInputElement } | null>(null)

  function displayValue(value: string | number | null | undefined) {
    return flattenOptions(options.options()).find(option => option.value === value)?.label ?? ''
  }

  function clear() {
    model.value = null
    search.value = ''
    options.onClear()
    input.value?.$el.focus()
  }

  function onInput(event: Event) {
    if (options.disabled() || (event as InputEvent).isComposing) return
    if ((event.target as HTMLInputElement).value === '' && model.value != null) model.value = null
  }

  function onHostClick(event: MouseEvent) {
    focusFieldFrom(event.currentTarget as HTMLElement, event.target as HTMLElement)
  }

  watch(open, value => {
    if (!value) keyboard.value = false
  })

  return { keyboard, input, displayValue, clear, onInput, onHostClick }
}
