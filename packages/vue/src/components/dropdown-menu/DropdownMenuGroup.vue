<script setup lang="ts">
  import { DropdownMenuGroup } from '../../primitives/dropdown-menu'
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnDropdownMenuGroup' })

  const props = defineProps<{ class?: string }>()
</script>

<template>
  <DropdownMenuGroup :class="cn('flex flex-col gap-0.5', props.class)">
    <slot />
  </DropdownMenuGroup>
</template>
