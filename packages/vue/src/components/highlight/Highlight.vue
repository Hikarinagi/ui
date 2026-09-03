<script setup lang="ts">
  import { computed } from 'vue'
  import { Motion } from 'motion-v'
  import { cn } from '../../lib/cn'
  import { TRANSITION, prefersReducedMotion } from '../../motion'

  defineOptions({ name: 'HnHighlight' })

  const props = withDefaults(
    defineProps<{
      id?: string
      as?: 'div' | 'li'
      class?: string
    }>(),
    { id: undefined, as: 'div' },
  )

  const transition = computed(() => (prefersReducedMotion() ? { duration: 0 } : TRANSITION.layout))
</script>

<template>
  <Motion
    :as="props.as"
    layout
    :layout-id="props.id"
    aria-hidden="true"
    data-hn-highlight
    :transition="transition"
    :class="cn('pointer-events-none', props.class)"
  />
</template>
