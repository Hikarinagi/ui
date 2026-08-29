<script setup lang="ts">
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnPageBody' })

  const props = defineProps<{ class?: string }>()
</script>

<template>
  <div :class="cn('flex min-w-0 flex-col gap-6', props.class)">
    <slot />
  </div>
</template>
