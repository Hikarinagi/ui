<script setup lang="ts">
  import { DropdownMenuLabel } from 'reka-ui'
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnDropdownMenuLabel' })

  const props = defineProps<{ class?: string }>()
</script>

<template>
  <DropdownMenuLabel :class="cn('text-muted px-2.5 py-1.5 text-xs font-medium', props.class)">
    <slot />
  </DropdownMenuLabel>
</template>
