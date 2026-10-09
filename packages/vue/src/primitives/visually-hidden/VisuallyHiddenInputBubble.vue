<script lang="ts">
  import type { VisuallyHiddenProps } from './VisuallyHidden.vue'

  export interface VisuallyHiddenInputBubbleProps<T> {
    name: string
    value: T
    checked?: boolean
    required?: boolean
    disabled?: boolean
    feature?: VisuallyHiddenProps['feature']
  }
</script>

<script setup lang="ts" generic="T">
  import { computed, watch } from 'vue'
  import VisuallyHidden from './VisuallyHidden.vue'
  import { usePrimitiveElement } from '../utils/usePrimitiveElement'

  defineOptions({ inheritAttrs: false })

  const props = withDefaults(defineProps<VisuallyHiddenInputBubbleProps<T>>(), {
    feature: 'fully-hidden',
    checked: undefined,
  })

  const { primitiveElement, currentElement } = usePrimitiveElement()
  const valueState = computed(() => props.checked ?? props.value)

  watch(valueState, (cur, prev) => {
    if (!currentElement.value) return
    const input = currentElement.value as HTMLInputElement
    const descriptor = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    ) as PropertyDescriptor
    const setValue = descriptor.set
    if (setValue && cur !== prev) {
      const inputEvent = new Event('input', { bubbles: true })
      const changeEvent = new Event('change', { bubbles: true })
      setValue.call(input, cur)
      input.dispatchEvent(inputEvent)
      input.dispatchEvent(changeEvent)
    }
  })
</script>

<template>
  <VisuallyHidden ref="primitiveElement" v-bind="{ ...props, ...$attrs }" as="input" />
</template>
