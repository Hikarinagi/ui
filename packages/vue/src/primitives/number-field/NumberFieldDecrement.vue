<script lang="ts">
  export interface NumberFieldDecrementProps extends PrimitiveProps {
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  import { useNumberFieldStep } from './context'
  import type { PrimitiveProps } from '../primitive'
  import { Primitive } from '../primitive'

  const props = withDefaults(defineProps<NumberFieldDecrementProps>(), { as: 'button' })
  const { primitiveElement, attributes } = useNumberFieldStep('decrease', props)
</script>

<template>
  <Primitive v-bind="{ ...props, ...attributes }" ref="primitiveElement" @contextmenu.prevent>
    <slot />
  </Primitive>
</template>
