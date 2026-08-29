<script setup lang="ts">
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnDescriptionList' })

  const props = defineProps<{ class?: string }>()
</script>

<template>
  <dl :class="cn('hn-dl', props.class)">
    <slot />
  </dl>
</template>
