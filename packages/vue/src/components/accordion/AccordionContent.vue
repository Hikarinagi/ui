<script setup lang="ts">
  import { AccordionContent as RekaAccordionContent } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { rekaAccordionStyle } from '../../lib/reka/styles'
  import { useCollapseGap } from '../../lib/collapse'
  import { accordionContent } from './accordion.variants'

  defineOptions({ name: 'HnAccordionContent' })

  const props = defineProps<{ class?: string }>()

  const content = useCollapseGap()
</script>

<template>
  <RekaAccordionContent
    ref="content"
    :class="cn(accordionContent(), props.class)"
    :style="rekaAccordionStyle"
  >
    <div class="pb-4">
      <slot />
    </div>
  </RekaAccordionContent>
</template>
