<script setup lang="ts">
  import { MenubarGroup } from '../../primitives/menubar'
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnMenubarGroup' })

  const props = defineProps<{ class?: string }>()
</script>

<template>
  <MenubarGroup :class="cn('flex flex-col gap-0.5', props.class)">
    <slot />
  </MenubarGroup>
</template>
