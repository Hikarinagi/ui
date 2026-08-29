<script setup lang="ts">
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnList' })

  const props = defineProps<{ ordered?: boolean; class?: string }>()
</script>

<template>
  <component :is="props.ordered ? 'ol' : 'ul'" :class="cn('hn-list', props.class)">
    <slot />
  </component>
</template>
