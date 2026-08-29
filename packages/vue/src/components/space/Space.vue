<script setup lang="ts">
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnSpace' })

  const props = defineProps<{
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    class?: string
  }>()

  const sizes = {
    xs: 'size-1',
    sm: 'size-2',
    md: 'size-4',
    lg: 'size-6',
    xl: 'size-8',
  } as const
</script>

<template>
  <div
    aria-hidden="true"
    :class="cn('shrink-0', props.size ? sizes[props.size] : 'flex-1 self-stretch', props.class)"
  />
</template>
