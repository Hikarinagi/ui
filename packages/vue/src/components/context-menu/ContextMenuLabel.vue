<script setup lang="ts">
  import { ContextMenuLabel } from 'reka-ui'
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnContextMenuLabel' })

  const props = defineProps<{ class?: string }>()
</script>

<template>
  <ContextMenuLabel :class="cn('text-muted px-2.5 py-1.5 text-xs font-medium', props.class)">
    <slot />
  </ContextMenuLabel>
</template>
