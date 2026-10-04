<script setup lang="ts">
  import type { PrimitiveProps } from '../../primitives/primitive'
  import { Primitive } from '../../primitives/primitive'
  import { VISUALLY_HIDDEN_STYLE } from '../../../../shared/src/primitives/visually-hidden'

  defineOptions({ name: 'HnVisuallyHidden' })

  const props = withDefaults(defineProps<PrimitiveProps>(), { as: 'span' })
</script>

<template>
  <Primitive :as="props.as" :as-child="props.asChild" :style="VISUALLY_HIDDEN_STYLE">
    <slot />
  </Primitive>
</template>
