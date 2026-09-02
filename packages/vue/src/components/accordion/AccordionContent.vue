<script setup lang="ts">
  import { onBeforeUpdate, onMounted, shallowRef, type ComponentPublicInstance } from 'vue'
  import { AccordionContent as RekaAccordionContent } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { writeCollapseGap } from '../../lib/collapse'
  import { accordionContent } from './accordion.variants'

  defineOptions({ name: 'HnAccordionContent' })

  const props = defineProps<{ class?: string }>()

  const content = shallowRef<ComponentPublicInstance | null>(null)

  function measure() {
    const el = content.value?.$el as Element | undefined
    if (el instanceof Element) writeCollapseGap(el, el.parentElement)
  }

  onMounted(measure)
  onBeforeUpdate(measure)
</script>

<template>
  <RekaAccordionContent ref="content" :class="cn(accordionContent(), props.class)">
    <div class="pb-4">
      <slot />
    </div>
  </RekaAccordionContent>
</template>
