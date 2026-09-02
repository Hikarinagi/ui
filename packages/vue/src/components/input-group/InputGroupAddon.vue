<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import { inputGroupAddon } from './input-group.variants'

  defineOptions({ name: 'HnInputGroupAddon' })

  const props = defineProps<{ class?: string }>()
</script>

<template>
  <span data-hn-input-group-addon :class="cn(inputGroupAddon(), props.class)">
    <slot />
  </span>
</template>
