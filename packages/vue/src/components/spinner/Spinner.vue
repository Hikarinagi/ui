<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'

  defineOptions({ name: 'HnSpinner', inheritAttrs: false })

  const props = withDefaults(defineProps<{ size?: 'sm' | 'md' | 'lg'; label?: string }>(), {
    size: 'md',
  })

  const t = useUiLocale()

  const sizes = { sm: 'size-3.5 border-[1.5px]', md: 'size-4 border-2', lg: 'size-5 border-2' }
</script>

<template>
  <span
    v-bind="$attrs"
    role="status"
    :aria-label="props.label ?? t.common.loading"
    :class="
      cn(
        'inline-block shrink-0 rounded-full border-current border-e-transparent align-[-0.125em]',
        sizes[props.size],
      )
    "
    :style="{
      animation: 'hn-spin var(--hn-spin-duration) var(--hn-ease-linear) infinite',
    }"
  />
</template>
