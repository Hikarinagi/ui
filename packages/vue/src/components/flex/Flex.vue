<script setup lang="ts">
  import type { Component } from 'vue'
  import { cn } from '../../lib/cn'
  import { flex, type FlexVariants } from './flex.variants'

  defineOptions({ name: 'HnFlex' })

  const props = withDefaults(
    defineProps<{
      as?: string | Component
      direction?: FlexVariants['direction']
      gap?: FlexVariants['gap']
      align?: FlexVariants['align']
      justify?: FlexVariants['justify']
      wrap?: boolean
      class?: string
    }>(),
    { as: 'div' },
  )
</script>

<template>
  <component
    :is="props.as"
    :class="cn(flex({ direction, gap, align, justify, wrap }), props.class)"
  >
    <slot />
  </component>
</template>
