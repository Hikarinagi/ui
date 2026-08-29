<script setup lang="ts">
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnCode' })

  const props = defineProps<{ class?: string }>()
</script>

<template>
  <code :class="cn('hn-code', props.class)"><slot /></code>
</template>
