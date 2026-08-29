<script setup lang="ts">
  import { SplitterPanel as RekaSplitterPanel } from 'reka-ui'
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnSplitterPanel' })

  const props = defineProps<{
    defaultSize?: number
    minSize?: number
    maxSize?: number
    collapsible?: boolean
    collapsedSize?: number
    class?: string
  }>()
</script>

<template>
  <RekaSplitterPanel
    :default-size="props.defaultSize"
    :min-size="props.minSize"
    :max-size="props.maxSize"
    :collapsible="props.collapsible"
    :collapsed-size="props.collapsedSize"
    :class="cn('min-h-0 min-w-0', props.class)"
  >
    <slot />
  </RekaSplitterPanel>
</template>
