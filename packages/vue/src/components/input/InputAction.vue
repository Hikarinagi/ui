<script setup lang="ts">
  import { Primitive } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { inputAction, inputAdornment } from './input.variants'

  defineOptions({ name: 'HnInputAction' })

  const props = defineProps<{
    label: string
    disabled?: boolean
    class?: string
  }>()
</script>

<template>
  <Primitive
    as="button"
    type="button"
    :aria-label="props.label"
    :disabled="props.disabled"
    :class="cn(inputAdornment(), inputAction(), props.class)"
    @mousedown.prevent
  >
    <slot />
  </Primitive>
</template>
