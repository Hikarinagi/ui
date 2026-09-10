<script setup lang="ts">
  import { computed } from 'vue'
  import { cn } from '../../lib/cn'
  import { focusFieldFrom } from '../../lib/field-focus'
  import { useFieldControl } from '../form-field/context'
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

  const { disabled } = useFieldControl({ disabled: () => props.disabled })

  provideInputGroup({
    size: computed(() => props.size),
    disabled,
    invalid: computed(() => !!props.invalid),
  })
</script>

<template>
  <div
    data-hn-input-group
    :data-invalid="props.invalid ? '' : undefined"
    :data-disabled="disabled ? '' : undefined"
    :class="cn(inputHost({ variant: props.variant, size: props.size }), inputGroup(), props.class)"
    @click="focusFieldFrom($event.currentTarget as HTMLElement, $event.target as HTMLElement)"
  >
    <slot />
  </div>
</template>
