<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import { space, type SpaceVariants } from './space.variants'

  defineOptions({ name: 'HnSpace' })

  const props = defineProps<{
    size?: SpaceVariants['size']
    class?: string
  }>()
</script>

<template>
  <div aria-hidden="true" :class="cn(space({ size: props.size }), props.class)" />
</template>
