<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import { inline, type InlineVariants } from './inline.variants'

  defineOptions({ name: 'HnInline' })

  const props = withDefaults(
    defineProps<{
      as?: string
      gap?: InlineVariants['gap']
      align?: InlineVariants['align']
      justify?: InlineVariants['justify']
      wrap?: boolean
      class?: string
    }>(),
    { as: 'div', wrap: true },
  )
</script>

<template>
  <component :is="props.as" :class="cn(inline({ gap, align, justify, wrap }), props.class)">
    <slot />
  </component>
</template>
