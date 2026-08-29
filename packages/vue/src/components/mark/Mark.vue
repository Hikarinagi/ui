<script setup lang="ts">
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnMark' })

  const props = defineProps<{ class?: string }>()
</script>

<template>
  <mark :class="cn('hn-mark', props.class)"><slot /></mark>
</template>
