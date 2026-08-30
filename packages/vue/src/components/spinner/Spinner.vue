<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import { spinner, type SpinnerVariants } from './spinner.variants'

  defineOptions({ name: 'HnSpinner', inheritAttrs: false })

  const props = withDefaults(defineProps<{ size?: SpinnerVariants['size']; label?: string }>(), {
    size: 'md',
  })

  const t = useUiLocale()
</script>

<template>
  <span
    v-bind="$attrs"
    role="status"
    :aria-label="props.label ?? t.common.loading"
    :class="cn(spinner({ size: props.size }))"
    :style="{
      animation: 'hn-spin var(--hn-spin-duration) var(--hn-ease-linear) infinite',
    }"
  />
</template>
