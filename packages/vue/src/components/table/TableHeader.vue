<script setup lang="ts">
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnTableHeader' })

  const props = defineProps<{ class?: string }>()
</script>

<template>
  <thead :class="cn(props.class)">
    <slot />
  </thead>
</template>
