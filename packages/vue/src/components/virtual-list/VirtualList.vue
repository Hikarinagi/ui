<script setup lang="ts" generic="T">
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import Spinner from '../spinner/Spinner.vue'
  import { useVirtualList } from './composables/useVirtualList'
  import {
    virtualList,
    virtualListContent,
    virtualListItem,
    virtualListStatus,
  } from './virtual-list.variants'
  import type { VirtualListProps, VirtualListRange, VirtualListSlotProps } from './types'

  defineOptions({ name: 'HnVirtualList' })

  const props = withDefaults(defineProps<VirtualListProps<T>>(), {
    estimateSize: 48,
    dynamic: true,
    height: 320,
    orientation: 'vertical',
    overscan: 5,
    gap: 0,
    paddingStart: 0,
    paddingEnd: 0,
    initialOffset: 0,
    loading: false,
    shadow: true,
  })

  const emit = defineEmits<{ rangeChange: [range: VirtualListRange] }>()
  defineSlots<{
    default?(props: VirtualListSlotProps<T>): unknown
    empty?(): unknown
    loading?(): unknown
  }>()

  const t = useUiLocale()
  const {
    root,
    rootDirection,
    area,
    list,
    viewport,
    entries,
    contentStyle,
    rootStyle,
    itemStyle,
    measureElement,
    measure,
    updateFocus,
    onFocusOut,
    scrollToIndex,
    scrollToOffset,
  } = useVirtualList(props, range => emit('rangeChange', range))

  defineExpose({ viewport, scrollToIndex, scrollToOffset, measure })
</script>

<template>
  <div
    ref="root"
    data-hn-virtual-list
    :dir="rootDirection"
    :class="cn(virtualList(), props.class)"
    :style="rootStyle"
  >
    <ScrollArea
      ref="area"
      class="min-h-0 flex-1"
      :direction="props.orientation"
      :shadow="props.shadow"
      :label="props.label"
      focusable
    >
      <ul
        ref="list"
        role="list"
        :aria-busy="props.loading"
        :class="virtualListContent()"
        :style="contentStyle"
        @focusin="updateFocus"
        @focusout="onFocusOut"
      >
        <li
          v-for="entry in entries"
          :key="entry.key"
          :ref="measureElement"
          :data-index="entry.index"
          :aria-posinset="entry.index + 1"
          :aria-setsize="props.items.length"
          :class="
            cn(
              virtualListItem({ orientation: props.orientation }),
              typeof props.itemClass === 'function'
                ? props.itemClass(props.items[entry.index]!, entry.index)
                : props.itemClass,
            )
          "
          :style="itemStyle(entry)"
        >
          <slot :item="props.items[entry.index]!" :index="entry.index" />
        </li>
      </ul>
    </ScrollArea>
    <div
      v-if="!props.items.length && !props.loading"
      :class="cn(virtualListStatus(), 'absolute inset-0')"
    >
      <slot name="empty">{{ props.emptyText ?? t.virtualList.empty }}</slot>
    </div>
    <div
      v-if="props.loading"
      :class="cn(virtualListStatus(), !props.items.length && 'absolute inset-0')"
    >
      <slot name="loading">
        <Spinner size="sm" />
        {{ t.common.loading }}
      </slot>
    </div>
  </div>
</template>
