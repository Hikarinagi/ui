<script setup lang="ts">
  import { ChevronRight } from '@lucide/vue'
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnBreadcrumbSeparator' })

  const props = defineProps<{ class?: string }>()
</script>

<template>
  <li aria-hidden="true" :class="cn('text-faint flex items-center', props.class)">
    <slot>
      <ChevronRight class="size-3.5" />
    </slot>
  </li>
</template>
