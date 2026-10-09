<script setup lang="ts">
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnDescriptionList' })

  const props = defineProps<{
    orientation?: 'vertical' | 'horizontal'
    class?: string
  }>()
</script>

<template>
  <dl
    :data-orientation="props.orientation === 'horizontal' ? 'horizontal' : undefined"
    :class="cn('hn-dl', props.class)"
  >
    <slot />
  </dl>
</template>
