<script setup lang="ts">
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnTableRow' })

  const props = defineProps<{ class?: string }>()
</script>

<template>
  <tr :class="cn(props.class)">
    <slot />
  </tr>
</template>
