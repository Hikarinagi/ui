<script setup lang="ts">
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnBlockquote' })

  const props = defineProps<{ cite?: string; class?: string }>()
</script>

<template>
  <blockquote :class="cn('hn-blockquote', props.class)">
    <slot />
    <footer v-if="props.cite" class="text-faint mt-2 text-sm">—— {{ props.cite }}</footer>
  </blockquote>
</template>
