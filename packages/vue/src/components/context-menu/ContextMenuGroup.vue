<script setup lang="ts">
  import { ContextMenuGroup } from 'reka-ui'
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnContextMenuGroup' })

  const props = defineProps<{ class?: string }>()
</script>

<template>
  <ContextMenuGroup :class="cn('flex flex-col gap-0.5', props.class)">
    <slot />
  </ContextMenuGroup>
</template>
