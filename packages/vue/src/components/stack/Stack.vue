<script setup lang="ts">
  import type { Component } from 'vue'
  import { cn } from '../../lib/cn'
  import { stack, type StackVariants } from './stack.variants'

  defineOptions({ name: 'HnStack' })

  const props = withDefaults(
    defineProps<{
      as?: string | Component
      gap?: StackVariants['gap']
      align?: StackVariants['align']
      justify?: StackVariants['justify']
      class?: string
    }>(),
    { as: 'div' },
  )
</script>

<template>
  <component :is="props.as" :class="cn(stack({ gap, align, justify }), props.class)">
    <slot />
  </component>
</template>
