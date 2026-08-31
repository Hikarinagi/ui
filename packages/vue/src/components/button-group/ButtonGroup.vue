<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import { buttonGroup, type ButtonGroupVariants } from './button-group.variants'

  defineOptions({ name: 'HnButtonGroup' })

  const props = withDefaults(
    defineProps<{
      label?: string
      orientation?: ButtonGroupVariants['orientation']
      block?: boolean
      divider?: boolean
      class?: string
    }>(),
    { orientation: 'horizontal', block: false, divider: false },
  )
</script>

<template>
  <div
    role="group"
    :aria-label="props.label"
    :aria-orientation="props.orientation === 'vertical' ? 'vertical' : undefined"
    :class="
      cn(
        buttonGroup({
          orientation: props.orientation,
          block: props.block,
          divider: props.divider,
        }),
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
