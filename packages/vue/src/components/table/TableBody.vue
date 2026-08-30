<script setup lang="ts">
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnTableBody' })

  const props = defineProps<{ class?: string }>()
</script>

<template>
  <tbody :class="cn(props.class)">
    <slot />
  </tbody>
</template>
