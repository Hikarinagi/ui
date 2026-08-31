<script setup lang="ts">
  import { DropdownMenuSeparator } from 'reka-ui'
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnDropdownMenuSeparator' })

  const props = defineProps<{ class?: string }>()
</script>

<template>
  <DropdownMenuSeparator :class="cn('bg-line -mx-1 my-1 h-px', props.class)" />
</template>
