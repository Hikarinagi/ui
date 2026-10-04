import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { unrefElement, type MaybeElement } from '@vueuse/core'

export function useFormControl(element: MaybeRefOrGetter<MaybeElement>) {
  return computed(() => (toValue(element) ? Boolean(unrefElement(element)?.closest('form')) : true))
}
