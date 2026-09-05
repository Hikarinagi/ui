<script setup lang="ts">
  import { computed } from 'vue'
  import type { InputVariants } from '../input/input.variants'
  import { provideInputGroup } from './context'

  defineOptions({ name: 'HnInputGroupScope' })

  const props = defineProps<{
    size?: InputVariants['size']
    disabled?: boolean
    invalid?: boolean
  }>()

  provideInputGroup({
    size: computed(() => props.size),
    disabled: computed(() => !!props.disabled),
    invalid: computed(() => !!props.invalid),
  })
</script>

<template>
  <slot />
</template>
