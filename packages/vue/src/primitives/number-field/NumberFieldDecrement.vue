<script lang="ts">
  import type { PrimitiveProps } from 'reka-ui'

  export interface NumberFieldDecrementProps extends PrimitiveProps {
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  import { Primitive } from 'reka-ui'
  import { useNumberFieldStep } from './context'

  const props = withDefaults(defineProps<NumberFieldDecrementProps>(), { as: 'button' })
  const { primitiveElement, attributes } = useNumberFieldStep('decrease', props)
</script>

<template>
  <Primitive v-bind="{ ...props, ...attributes }" ref="primitiveElement" @contextmenu.prevent>
    <slot />
  </Primitive>
</template>
