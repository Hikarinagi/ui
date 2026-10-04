<script setup lang="ts">
  import type { PrimitiveProps } from '../../primitives/primitive'
  import { Primitive } from '../../primitives/primitive'

  defineOptions({ name: 'HnVisuallyHidden' })

  const props = withDefaults(defineProps<PrimitiveProps>(), { as: 'span' })

  const hidden = {
    position: 'absolute',
    border: 0,
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
    wordWrap: 'normal',
    top: '-1px',
    left: '-1px',
  } as const
</script>

<template>
  <Primitive :as="props.as" :as-child="props.asChild" :style="hidden">
    <slot />
  </Primitive>
</template>
