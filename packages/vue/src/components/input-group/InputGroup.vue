<script setup lang="ts">
  import { computed } from 'vue'
  import { cn } from '../../lib/cn'
  import { focusFieldFrom } from '../../lib/field-focus'
  import { inputHost, type InputVariants } from '../input/input.variants'
  import { provideInputGroup } from './context'
  import { inputGroup } from './input-group.variants'

  defineOptions({ name: 'HnInputGroup' })

  const props = defineProps<{
    variant?: InputVariants['variant']
    size?: InputVariants['size']
    disabled?: boolean
    invalid?: boolean
    class?: string
  }>()

  provideInputGroup({
    size: computed(() => props.size),
    disabled: computed(() => !!props.disabled),
    invalid: computed(() => !!props.invalid),
  })
</script>

<template>
  <div
    data-hn-input-group
    :data-invalid="props.invalid ? '' : undefined"
    :class="cn(inputHost({ variant: props.variant, size: props.size }), inputGroup(), props.class)"
    @click="focusFieldFrom($event.currentTarget as HTMLElement, $event.target as HTMLElement)"
  >
    <slot />
  </div>
</template>
