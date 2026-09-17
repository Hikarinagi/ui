<script setup lang="ts" generic="T extends { label: string; disabled?: boolean }">
  import { toRef } from 'vue'
  import type { FlattenedItem } from 'reka-ui'
  import type { VirtualizeOptions } from '../../lib/virtual/types'
  import { useVirtualTree } from '../../lib/reka/useVirtualTree'
  import { virtualListContent, virtualListItem } from '../virtual-list/virtual-list.variants'

  const props = defineProps<{
    items: FlattenedItem<T>[]
    virtualize?: VirtualizeOptions
    viewport?: HTMLElement
    disabled?: (node: T) => boolean
  }>()
  defineSlots<{ default(props: { item: FlattenedItem<T> }): unknown }>()
  const { body, entries, bodyStyle, measure, focusFirst, focusLast, isFirst } = useVirtualTree(
    props,
    toRef(props, 'viewport'),
  )
  defineExpose({ focusFirst, focusLast, isFirst })
</script>

<template>
  <div
    ref="body"
    data-hn-virtual-tree
    role="presentation"
    :class="virtualListContent({ orientation: 'vertical' })"
    :style="bodyStyle"
  >
    <div
      v-for="entry in entries"
      :key="entry.key"
      :ref="measure"
      :data-index="entry.index"
      role="presentation"
      :class="virtualListItem({ orientation: 'vertical' })"
      :style="{ marginBlockStart: `${entry.gapBefore}px` }"
    >
      <slot :item="props.items[entry.index]!" />
    </div>
  </div>
</template>
