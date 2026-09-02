<script setup lang="ts">
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnDescriptionTerm' })

  const props = defineProps<{ class?: string }>()
</script>

<template>
  <dt :class="cn(props.class)">
    <slot />
  </dt>
</template>
