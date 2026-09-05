<script setup lang="ts">
  import { MenubarLabel } from 'reka-ui'
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnMenubarLabel' })

  const props = defineProps<{ class?: string }>()
</script>

<template>
  <MenubarLabel :class="cn('text-muted px-2.5 py-1.5 text-xs font-medium', props.class)">
    <slot />
  </MenubarLabel>
</template>
