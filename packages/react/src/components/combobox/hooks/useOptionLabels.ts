'use client'

import { useState } from 'react'
import { flattenOptions, type SelectItems, type SelectOption } from '../../select/types'

export function useOptionLabels<T extends SelectOption>(
  options: SelectItems<T>,
  selectedOptions: readonly T[] | undefined,
) {
  const [labels] = useState(() => new Map<string | number, string>())
  for (const option of flattenOptions(options)) labels.set(option.value, option.label)
  for (const option of selectedOptions ?? []) labels.set(option.value, option.label)
  return labels
}
