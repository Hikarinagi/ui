<script setup lang="ts" generic="T">
  import { computed, shallowRef } from 'vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import Empty from '../empty/Empty.vue'
  import LoadingOverlay from '../loading-overlay/LoadingOverlay.vue'
  import DataListPagination from './DataListPagination.vue'
  import DataListLayoutToggle from './DataListLayoutToggle.vue'
  import DataListContent from './DataListContent.vue'
  import DataListItem from './DataListItem.vue'
  import { useDataList } from './composables/useDataList'
  import { useDataListBody } from './composables/useDataListBody'
  import {
    dataList,
    dataListHeader,
    dataListBody,
    dataListStatus,
    dataListFooter,
    dataListPager,
    dataListAnnouncement,
    dataListLoading,
  } from './data-list.variants'
  import type {
    DataListExpose,
    DataListItemSlot,
    DataListLayout,
    DataListPageChange,
    DataListPlaceholderSlot,
    DataListProps,
    DataListRange,
    DataListState,
  } from './types'

  defineOptions({ name: 'HnDataList' })
  const props = withDefaults(defineProps<DataListProps<T>>(), {
    gridMin: '14rem',
    size: 'md',
    divided: true,
    minHeight: 160,
  })
  const layout = defineModel<DataListLayout>('layout', { default: 'list' })
  const page = defineModel<number>('page', { default: 1 })
  const pageSize = defineModel<number>('pageSize', { default: 10 })
  const emit = defineEmits<{
    pageChange: [value: DataListPageChange]
    rangeChange: [value: DataListRange]
  }>()
  const slots = defineSlots<{
    default?(props: DataListItemSlot<T>): unknown
    media?(props: DataListItemSlot<T>): unknown
    title?(props: DataListItemSlot<T>): unknown
    description?(props: DataListItemSlot<T>): unknown
    meta?(props: DataListItemSlot<T>): unknown
    actions?(props: DataListItemSlot<T>): unknown
    placeholder?(props: DataListPlaceholderSlot): unknown
    header?(props: DataListState<T>): unknown
    footer?(props: DataListState<T>): unknown
    pagination?(props: DataListState<T>): unknown
    empty?(props: DataListState<T>): unknown
    loading?(props: DataListState<T>): unknown
  }>()
  const t = useUiLocale()
  const { entries, state, itemClass, placeholderCount, showPagination, formatItem } = useDataList(
    props,
    page,
    pageSize,
    value => emit('pageChange', value),
    layout,
  )
  const { body, style } = useDataListBody(props)
  const content = shallowRef<DataListExpose>()
  const viewport = computed(() => content.value?.viewport)
  defineExpose({
    viewport,
    scrollToIndex: (...args: Parameters<DataListExpose['scrollToIndex']>) =>
      content.value?.scrollToIndex(...args),
  })
</script>
<template>
  <div
    data-hn-data-list
    :data-layout="layout"
    :aria-busy="props.loading || undefined"
    :class="cn(dataList(), props.class)"
  >
    <div v-if="slots.header || props.layoutToggle" :class="dataListHeader()">
      <slot name="header" v-bind="state" />
      <DataListLayoutToggle v-if="props.layoutToggle" v-model="layout" class="ms-auto" />
    </div>
    <div ref="body" :class="cn(dataListBody(), props.bodyClass)" :style="style">
      <span
        v-if="props.loading && !entries.length && !slots.loading"
        role="status"
        :class="dataListAnnouncement()"
      >
        {{ t.common.loading }}
      </span>
      <DataListContent
        v-if="entries.length || (props.loading && !slots.loading)"
        ref="content"
        :options="props"
        :entries="entries"
        :layout="layout"
        :structured="!slots.default"
        :placeholder-count="placeholderCount"
        :item-class="itemClass"
        @range-change="emit('rangeChange', $event)"
      >
        <template #default="entry">
          <slot v-bind="entry">
            <DataListItem
              v-bind="formatItem(entry)"
              :layout="layout"
              :media-ratio="props.mediaRatio"
            >
              <template v-if="slots.media" #media><slot name="media" v-bind="entry" /></template>
              <template v-if="slots.title" #title><slot name="title" v-bind="entry" /></template>
              <template v-if="slots.description" #description>
                <slot name="description" v-bind="entry" />
              </template>
              <template v-if="slots.meta" #meta><slot name="meta" v-bind="entry" /></template>
              <template v-if="slots.actions" #actions>
                <slot name="actions" v-bind="entry" />
              </template>
            </DataListItem>
          </slot>
        </template>
        <template #placeholder="placeholder">
          <slot name="placeholder" v-bind="placeholder">
            <DataListItem
              :layout="layout"
              placeholder
              :title-placeholder="!!(props.itemTitle || slots.title || slots.default)"
              :description-placeholder="!!(props.itemDescription || slots.description)"
              :media-ratio="props.mediaRatio"
              :media="!!slots.media"
              :meta="!!slots.meta"
              :actions="!!slots.actions"
            />
          </slot>
        </template>
      </DataListContent>
      <div v-else role="status" :class="dataListStatus()">
        <slot v-if="props.loading" name="loading" v-bind="state" />
        <slot v-else name="empty" v-bind="state">
          <Empty :title="props.emptyText ?? t.dataList.empty" :icon="false" size="sm" />
        </slot>
      </div>
      <LoadingOverlay
        v-if="entries.length"
        :visible="props.loading"
        :text="t.common.loading"
        :min-visible="0"
        size="sm"
        :class="dataListLoading()"
      >
        <template v-if="slots.loading" #default><slot name="loading" v-bind="state" /></template>
      </LoadingOverlay>
    </div>
    <div
      v-if="slots.footer || showPagination || (props.pagination && slots.pagination)"
      :class="dataListFooter()"
    >
      <slot name="footer" v-bind="state" />
      <div v-if="showPagination || (props.pagination && slots.pagination)" :class="dataListPager()">
        <slot name="pagination" v-bind="state"><DataListPagination :state="state" /></slot>
      </div>
    </div>
  </div>
</template>
