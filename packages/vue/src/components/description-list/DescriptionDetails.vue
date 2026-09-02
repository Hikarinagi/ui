<script setup lang="ts">
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnDescriptionDetails' })

  const props = defineProps<{ class?: string }>()
</script>

<template>
  <dd :class="cn(props.class)">
    <slot />
  </dd>
</template>
