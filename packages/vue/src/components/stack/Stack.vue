<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import { stack, type StackVariants } from './stack.variants'

  defineOptions({ name: 'HnStack' })

  const props = withDefaults(
    defineProps<{
      as?: string
      gap?: StackVariants['gap']
      align?: StackVariants['align']
      class?: string
    }>(),
    { as: 'div' },
  )
</script>

<template>
  <component :is="props.as" :class="cn(stack({ gap, align }), props.class)">
    <slot />
  </component>
</template>
