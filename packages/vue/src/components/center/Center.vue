<script setup lang="ts">
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnCenter' })

  const props = withDefaults(
    defineProps<{
      as?: string
      inline?: boolean
      class?: string
    }>(),
    { as: 'div', inline: false },
  )
</script>

<template>
  <component
    :is="props.as"
    :class="cn(props.inline ? 'inline-flex' : 'flex', 'items-center justify-center', props.class)"
  >
    <slot />
  </component>
</template>
