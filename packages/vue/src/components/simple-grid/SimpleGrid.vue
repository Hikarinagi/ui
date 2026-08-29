<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import { simpleGrid, type SimpleGridVariants } from './simple-grid.variants'

  defineOptions({ name: 'HnSimpleGrid' })

  const props = withDefaults(
    defineProps<{
      as?: string
      min?: string
      fit?: boolean
      gap?: SimpleGridVariants['gap']
      class?: string
    }>(),
    { as: 'div', min: '14rem', fit: false },
  )
</script>

<template>
  <component
    :is="props.as"
    :style="{ '--hn-simple-grid-min': props.min }"
    :class="cn(simpleGrid({ fit, gap }), props.class)"
  >
    <slot />
  </component>
</template>
