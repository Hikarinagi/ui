<script setup lang="ts">
  import type { PrimitiveProps } from '../../primitives/primitive'
  import { DismissableLayerBranch } from '../../primitives/dismissable-layer'

  defineOptions({ name: 'HnOverlayBranch' })

  const props = withDefaults(defineProps<PrimitiveProps>(), { as: 'div' })
</script>

<template>
  <DismissableLayerBranch :as="props.as" :as-child="props.asChild">
    <slot />
  </DismissableLayerBranch>
</template>
