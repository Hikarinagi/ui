import { computed } from 'vue'
import {
  nextSingleOrMultipleValue,
  singleOrMultipleDefault,
  singleOrMultipleType,
  type SingleOrMultipleType,
} from '../../../../shared/src/primitives/value'
import { useVModel } from './useVModel'

export interface SingleOrMultipleProps<T = unknown> {
  type?: SingleOrMultipleType
  modelValue?: T | T[]
  defaultValue?: T | T[]
}

export function useSingleOrMultipleValue<T, P extends SingleOrMultipleProps<T>>(
  props: P,
  emits: (name: 'update:modelValue', value: T | T[] | undefined) => void,
) {
  const type = computed(() => singleOrMultipleType(props))
  const modelValue = useVModel(props, 'modelValue', emits as never, {
    defaultValue: singleOrMultipleDefault(props) as P['modelValue'],
    passive: props.modelValue === undefined,
  })

  function changeModelValue(value: T) {
    modelValue.value = nextSingleOrMultipleValue(
      type.value,
      modelValue.value as T | T[] | undefined,
      value,
    ) as P['modelValue']
  }

  const isSingle = computed(() => type.value === 'single')
  return { modelValue, changeModelValue, isSingle }
}
