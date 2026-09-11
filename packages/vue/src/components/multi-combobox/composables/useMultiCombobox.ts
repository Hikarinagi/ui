import { computed, reactive, ref, shallowRef, watch, type Ref } from 'vue'
import { focusFieldFrom } from '../../../lib/field-focus'
import { flattenOptions, type SelectItems, type SelectOption } from '../../select/types'

interface MultiComboboxOptions<T extends SelectOption> {
  options: () => SelectItems<T>
  model: Ref<Array<string | number>>
  open: Ref<boolean>
  disabled: () => boolean
  onClear: () => void
}

export function useMultiCombobox<T extends SelectOption>(options: MultiComboboxOptions<T>) {
  const { model, open } = options
  const keyboard = ref(false)
  const input = shallowRef<{ $el: HTMLInputElement } | null>(null)
  const labels = reactive(new Map<string | number, string>())
  watch(
    options.options,
    options => {
      for (const option of flattenOptions(options)) labels.set(option.value, option.label)
    },
    { immediate: true, deep: true },
  )

  const selected = computed(() =>
    model.value.map(value => ({ value, label: labels.get(value) ?? String(value) })),
  )

  watch(open, value => {
    if (!value) keyboard.value = false
  })

  function remove(value: string | number) {
    if (options.disabled()) return
    model.value = model.value.filter(item => item !== value)
  }

  function clear() {
    if (!model.value.length) return
    model.value = []
    options.onClear()
    input.value?.$el.focus()
  }

  function onHostClick(event: MouseEvent) {
    const focused = focusFieldFrom(event.currentTarget as HTMLElement, event.target as HTMLElement)
    if (focused && !open.value) open.value = true
  }

  function onInputKeydown(event: KeyboardEvent) {
    keyboard.value = true
    if (
      event.key !== 'Backspace' ||
      (event.target as HTMLInputElement).value !== '' ||
      !model.value.length
    )
      return
    model.value = model.value.slice(0, -1)
  }

  return { selected, keyboard, input, remove, clear, onHostClick, onInputKeydown }
}
