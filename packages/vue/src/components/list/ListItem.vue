<script setup lang="ts">
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnListItem' })

  const props = defineProps<{ class?: string }>()
</script>

<template>
  <li :class="cn(props.class)">
    <slot />
  </li>
</template>
