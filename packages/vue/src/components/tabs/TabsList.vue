<script setup lang="ts">
  import { computed, shallowRef } from 'vue'
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

  const area = shallowRef<InstanceType<typeof ScrollArea> | null>(null)

  defineExpose({
    viewport: computed(() => area.value?.viewport),
    instance: computed(() => area.value?.instance),
  })
</script>

<template>
  <ScrollArea
    ref="area"
    :direction="orientation"
    :scrollbar="false"
    :class="cn(tabsScroll({ variant, orientation }), props.class)"
  >
    <TabsList :aria-label="props.label" :class="cn(tabsList({ variant, orientation }))">
      <slot />
    </TabsList>
  </ScrollArea>
</template>
