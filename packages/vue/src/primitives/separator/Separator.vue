<script lang="ts">
  export interface SeparatorProps extends PrimitiveProps {
    orientation?: SeparatorOrientation
    decorative?: boolean
  }
</script>

<script setup lang="ts">
  import { computed } from 'vue'
  import {
    separatorOrientation,
    separatorSemantics,
    type SeparatorOrientation,
  } from '../../../../shared/src/primitives/separator'
  import { Primitive, type PrimitiveProps } from '../primitive'

  const props = withDefaults(defineProps<SeparatorProps>(), { orientation: 'horizontal' })
  const orientation = computed(() => separatorOrientation(props.orientation))
  const semantics = computed(() => separatorSemantics(orientation.value, props.decorative))
</script>

<template>
  <Primitive :as="as" :as-child="asChild" :data-orientation="orientation" v-bind="semantics">
    <slot />
  </Primitive>
</template>
