<script setup lang="ts">
  import { onBeforeUpdate, onMounted, shallowRef, type ComponentPublicInstance } from 'vue'
  import { CollapsibleContent as RekaCollapsibleContent } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { writeCollapseGap } from '../../lib/collapse'

  defineOptions({ name: 'HnCollapsibleContent' })

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
  <RekaCollapsibleContent
    ref="content"
    :class="
      cn('hn-anim-collapse [--hn-collapse-h:var(--reka-collapsible-content-height)]', props.class)
    "
  >
    <slot />
  </RekaCollapsibleContent>
</template>
