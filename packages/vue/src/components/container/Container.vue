<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import { container, type ContainerVariants } from './container.variants'

  defineOptions({ name: 'HnContainer' })

  const props = withDefaults(
    defineProps<{
      as?: string
      size?: ContainerVariants['size']
      class?: string
    }>(),
    { as: 'div' },
  )
</script>

<template>
  <component :is="props.as" :class="cn(container({ size }), props.class)">
    <slot />
  </component>
</template>
