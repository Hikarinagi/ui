<script lang="ts">
  export interface ProgressIndicatorProps extends PrimitiveProps {}
</script>

<script setup lang="ts">
  import { Primitive, type PrimitiveProps } from '../primitive'
  import { useForwardExpose } from '../utils/useForwardExpose'
  import { injectProgressRootContext } from './context'

  const props = defineProps<ProgressIndicatorProps>()
  const rootContext = injectProgressRootContext()
  useForwardExpose()
</script>

<template>
  <Primitive
    v-bind="props"
    :data-state="rootContext.progressState.value"
    :data-value="rootContext.modelValue?.value ?? undefined"
    :data-max="rootContext.max.value"
  >
    <slot />
  </Primitive>
</template>
