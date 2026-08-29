<script setup lang="ts">
  import { CollapsibleTrigger as RekaCollapsibleTrigger } from 'reka-ui'
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnCollapsibleTrigger' })

  const props = defineProps<{
    asChild?: boolean
    class?: string
  }>()
</script>

<template>
  <RekaCollapsibleTrigger :as-child="props.asChild" :class="cn(props.class)">
    <slot />
  </RekaCollapsibleTrigger>
</template>
