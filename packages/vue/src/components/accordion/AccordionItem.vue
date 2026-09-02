<script setup lang="ts">
  import { AccordionItem as RekaAccordionItem } from 'reka-ui'
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnAccordionItem' })

  const props = defineProps<{
    value: string
    disabled?: boolean
    class?: string
  }>()
</script>

<template>
  <RekaAccordionItem :value="props.value" :disabled="props.disabled" :class="cn(props.class)">
    <slot />
  </RekaAccordionItem>
</template>
