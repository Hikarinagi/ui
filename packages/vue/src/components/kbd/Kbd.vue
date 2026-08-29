<script setup lang="ts">
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnKbd' })

  const props = defineProps<{ class?: string }>()
</script>

<template>
  <kbd :class="cn('hn-kbd', props.class)"><slot /></kbd>
</template>
