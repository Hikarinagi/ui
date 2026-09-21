<script setup lang="ts">
  import { CollapsibleContent as RekaCollapsibleContent } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { rekaCollapsibleStyle } from '../../lib/reka/styles'
  import { useCollapseGap } from '../../lib/collapse'

  defineOptions({ name: 'HnCollapsibleContent' })

  const props = defineProps<{ class?: string }>()

  const content = useCollapseGap()
</script>

<template>
  <RekaCollapsibleContent
    ref="content"
    :class="cn('hn-anim-collapse', props.class)"
    :style="rekaCollapsibleStyle"
  >
    <slot />
  </RekaCollapsibleContent>
</template>
