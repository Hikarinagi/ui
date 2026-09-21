<script setup lang="ts" generic="T">
  import { computed, shallowRef } from 'vue'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import { cn } from '../../lib/cn'
  import { useDataListWindow } from './composables/useDataListWindow'
  import {
    dataListContent,
    dataListViewport,
    dataListItem,
    dataListSpacer,
  } from './data-list.variants'
  import type { DataListItemSlot, DataListLayout, DataListProps, DataListRange } from './types'
  const props = defineProps<{
    options: DataListProps<T>
    entries: readonly DataListItemSlot<T>[]
    layout: DataListLayout
    structured: boolean
    placeholderCount: number
    itemClass: (entry: DataListItemSlot<T>, structured: boolean) => string
  }>()
  const emit = defineEmits<{ rangeChange: [range: DataListRange] }>()
  defineSlots<{
    default(props: DataListItemSlot<T>): unknown
    placeholder(props: { index: number; layout: DataListLayout }): unknown
  }>()
  const content = shallowRef<HTMLElement>()
  const area = shallowRef<InstanceType<typeof ScrollArea>>()
  const bounded = computed(() => !!props.options.virtualize || props.options.height !== undefined)
  const viewport = computed(() => (bounded.value ? area.value?.viewport : undefined))
  const initialLoading = computed(() => !!props.options.loading && !props.entries.length)
  const { rendered, style, before, after, scrollToIndex, updateFocus, focusOut } =
    useDataListWindow(props, content, viewport, range => emit('rangeChange', range))
  defineExpose({ viewport, scrollToIndex, content })
</script>
<template>
  <component
    :is="bounded ? ScrollArea : 'div'"
    ref="area"
    v-bind="bounded ? { label: options.label, focusable: true } : {}"
    :class="bounded ? dataListViewport() : undefined"
  >
    <ul
      ref="content"
      data-hn-data-list-content
      role="list"
      :aria-label="options.label"
      :aria-hidden="initialLoading || undefined"
      :inert="options.loading || undefined"
      :class="
        cn(
          dataListContent({ layout, gap: layout === 'grid' ? (options.gridGap ?? 'md') : 'none' }),
          options.contentClass,
        )
      "
      :style="style"
      @focusin="updateFocus"
      @focusout="focusOut"
    >
      <template v-if="initialLoading">
        <li
          v-for="index in placeholderCount"
          :key="index"
          :class="
            dataListItem({ layout, divided: options.divided, size: options.size, structured })
          "
        >
          <slot name="placeholder" :index="index - 1" :layout="layout" />
        </li>
      </template>
      <template v-else>
        <li
          v-if="before"
          role="presentation"
          aria-hidden="true"
          :class="dataListSpacer()"
          :style="{ height: `${before}px` }"
        />
        <li
          v-for="entry in rendered"
          :key="entry.key"
          data-hn-data-list-item
          :data-index="entry.index"
          :data-virtual-row="entry.row"
          :aria-posinset="options.virtualize ? entry.index + 1 : undefined"
          :aria-setsize="
            options.virtualize
              ? options.manual
                ? (options.total ?? -1)
                : options.items.length
              : undefined
          "
          :class="itemClass(entry, structured)"
          :style="entry.gapBefore ? { marginBlockStart: `${entry.gapBefore}px` } : undefined"
        >
          <slot v-bind="entry" />
        </li>
        <li
          v-if="after"
          role="presentation"
          aria-hidden="true"
          :class="dataListSpacer()"
          :style="{ height: `${after}px` }"
        />
      </template>
    </ul>
  </component>
</template>
