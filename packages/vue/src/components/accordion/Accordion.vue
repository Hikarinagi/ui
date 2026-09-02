<script setup lang="ts">
  import { AccordionRoot, useForwardPropsEmits, type AccordionRootEmits } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { accordion } from './accordion.variants'

  defineOptions({ name: 'HnAccordion' })

  const props = withDefaults(
    defineProps<{
      type?: 'single' | 'multiple'
      collapsible?: boolean
      modelValue?: string | string[]
      defaultValue?: string | string[]
      disabled?: boolean
      class?: string
    }>(),
    { type: 'single' },
  )
  const emits = defineEmits<AccordionRootEmits>()

  const forwarded = useForwardPropsEmits(
    () => ({
      type: props.type,
      collapsible: props.collapsible,
      modelValue: props.modelValue,
      defaultValue: props.defaultValue,
      disabled: props.disabled,
    }),
    emits,
  )
</script>

<template>
  <AccordionRoot v-bind="forwarded" :class="cn(accordion(), props.class)">
    <slot />
  </AccordionRoot>
</template>
