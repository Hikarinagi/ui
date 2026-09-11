<script setup lang="ts">
  import { Motion } from 'motion-v'
  import { cn } from '../../lib/cn'
  import { useHighlightMotion } from './composables/useHighlightMotion'

  defineOptions({ name: 'HnHighlight' })

  const props = withDefaults(
    defineProps<{
      id?: string
      axis?: 'x' | 'y' | 'both'
      as?: 'div' | 'li'
      class?: string
    }>(),
    { id: undefined, axis: 'both', as: 'div' },
  )

  const { transition, transformTemplate } = useHighlightMotion(() => props.axis)
</script>

<template>
  <Motion
    :as="props.as"
    layout
    :layout-id="props.id"
    aria-hidden="true"
    data-hn-highlight
    :transition="transition"
    :transform-template="transformTemplate"
    :class="cn('pointer-events-none', props.class)"
  />
</template>
