<script setup lang="ts">
  import { CollapsibleContent as RekaCollapsibleContent } from 'reka-ui'
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnCollapsibleContent' })

  const props = defineProps<{ class?: string }>()
</script>

<template>
  <RekaCollapsibleContent
    :class="
      cn('hn-anim-collapse [--hn-collapse-h:var(--reka-collapsible-content-height)]', props.class)
    "
  >
    <slot />
  </RekaCollapsibleContent>
</template>
