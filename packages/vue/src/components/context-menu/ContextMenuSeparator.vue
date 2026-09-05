<script setup lang="ts">
  import { ContextMenuSeparator } from 'reka-ui'
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnContextMenuSeparator' })

  const props = defineProps<{ class?: string }>()
</script>

<template>
  <ContextMenuSeparator :class="cn('bg-line -mx-1 my-1 h-px', props.class)" />
</template>
