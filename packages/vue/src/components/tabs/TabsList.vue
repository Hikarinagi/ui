<script setup lang="ts">
  import { shallowRef, type ComponentPublicInstance } from 'vue'
  import { TabsList } from 'reka-ui'
  import Highlight from '../highlight/Highlight.vue'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import { cn } from '../../lib/cn'
  import { useTabsStyle } from './context'
  import { useActiveTrigger } from './composables/useActiveTrigger'
  import { tabsList, tabsScroll, tabsHighlight } from './tabs.variants'

  defineOptions({ name: 'HnTabsList' })

  const props = defineProps<{
    label?: string
    class?: string
  }>()

  const { variant, orientation } = useTabsStyle()
  const listRef = shallowRef<ComponentPublicInstance | null>(null)
  const active = useActiveTrigger(listRef)
</script>

<template>
  <ScrollArea
    :direction="orientation"
    :scrollbar="false"
    :class="cn(tabsScroll({ variant, orientation }), props.class)"
  >
    <TabsList
      ref="listRef"
      :aria-label="props.label"
      :class="cn(tabsList({ variant, orientation }))"
    >
      <Highlight
        :target="active"
        :axis="orientation === 'vertical' ? 'y' : 'x'"
        :class="tabsHighlight({ variant, orientation })"
      />
      <slot />
    </TabsList>
  </ScrollArea>
</template>
