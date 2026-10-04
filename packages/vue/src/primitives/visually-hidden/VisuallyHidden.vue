<script lang="ts">
  export interface VisuallyHiddenProps extends PrimitiveProps {
    feature?: VisuallyHiddenFeature
  }
</script>

<script setup lang="ts">
  import {
    isAriaHidden,
    isFullyHidden,
    VISUALLY_HIDDEN_STYLE,
    type VisuallyHiddenFeature,
  } from '../../../../shared/src/primitives/visually-hidden'
  import { Primitive, type PrimitiveProps } from '../primitive'

  withDefaults(defineProps<VisuallyHiddenProps>(), { feature: 'focusable', as: 'span' })
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :aria-hidden="isAriaHidden(feature) ? 'true' : undefined"
    :data-hidden="isFullyHidden(feature) ? '' : undefined"
    :tabindex="isFullyHidden(feature) ? '-1' : undefined"
    :style="VISUALLY_HIDDEN_STYLE"
  >
    <slot />
  </Primitive>
</template>
