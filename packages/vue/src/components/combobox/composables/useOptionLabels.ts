import { reactive, watch } from 'vue'
import { flattenOptions, type SelectItems, type SelectOption } from '../../select/types'

export function useOptionLabels<T extends SelectOption>(
  options: () => SelectItems<T>,
  selectedOptions: () => T[] | undefined,
) {
  const labels = reactive(new Map<string | number, string>())

  watch(
    [options, selectedOptions],
    ([items, selected]) => {
      for (const option of flattenOptions(items)) labels.set(option.value, option.label)
      for (const option of selected ?? []) labels.set(option.value, option.label)
    },
    { immediate: true, deep: true },
  )

  return labels
}
