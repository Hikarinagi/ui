<script setup lang="ts">
  import { TabsList } from 'reka-ui'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import { cn } from '../../lib/cn'
  import { useTabsStyle } from './context'
  import { tabsList, tabsScroll } from './tabs.variants'

  defineOptions({ name: 'HnTabsList' })

  const props = defineProps<{
    label?: string
    class?: string
  }>()

  const { variant, orientation } = useTabsStyle()
</script>

<template>
  <ScrollArea
    :direction="orientation"
    :scrollbar="false"
    :class="cn(tabsScroll({ variant, orientation }), props.class)"
  >
    <TabsList :aria-label="props.label" :class="cn(tabsList({ variant, orientation }))">
      <slot />
    </TabsList>
  </ScrollArea>
</template>
