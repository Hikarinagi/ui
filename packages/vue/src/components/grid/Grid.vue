<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import { grid, type GridVariants } from './grid.variants'

  defineOptions({ name: 'HnGrid' })

  const props = withDefaults(
    defineProps<{
      as?: string
      cols?: GridVariants['cols']
      gap?: GridVariants['gap']
      class?: string
    }>(),
    { as: 'div' },
  )
</script>

<template>
  <component :is="props.as" :class="cn(grid({ cols, gap }), props.class)">
    <slot />
  </component>
</template>
