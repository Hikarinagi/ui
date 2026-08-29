<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import { input, type InputVariants } from './input.variants'

  defineOptions({ name: 'HnInput', inheritAttrs: false })

  const props = defineProps<{
    variant?: InputVariants['variant']
    size?: InputVariants['size']
    disabled?: boolean
    invalid?: boolean
    class?: string
  }>()

  const model = defineModel<string>()
</script>

<template>
  <input
    v-bind="$attrs"
    v-model="model"
    :disabled="props.disabled"
    :data-invalid="props.invalid ? '' : undefined"
    :aria-invalid="props.invalid || undefined"
    :class="cn(input({ variant: props.variant, size: props.size }), props.class)"
  />
</template>
