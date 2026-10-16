<script setup lang="ts">
  import { MenubarSeparator } from '../../primitives/menubar'
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnMenubarSeparator' })

  const props = defineProps<{ class?: string }>()
</script>

<template>
  <MenubarSeparator :class="cn('bg-line -mx-1 my-1 h-px', props.class)" />
</template>
