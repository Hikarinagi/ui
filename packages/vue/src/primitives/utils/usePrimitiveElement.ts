import { computed, ref, type ComponentPublicInstance } from 'vue'

export function usePrimitiveElement<T extends ComponentPublicInstance>() {
  const primitiveElement = ref<T>()
  const currentElement = computed<HTMLElement | undefined>(() => {
    const element = primitiveElement.value?.$el as Element | undefined
    if (element && ['#text', '#comment'].includes(element.nodeName))
      return element.nextElementSibling as HTMLElement | undefined
    return (element ?? primitiveElement.value) as HTMLElement | undefined
  })
  return { primitiveElement, currentElement }
}
