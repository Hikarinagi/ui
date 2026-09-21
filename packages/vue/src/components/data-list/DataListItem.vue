<script setup lang="ts">
  import Skeleton from '../skeleton/Skeleton.vue'
  import {
    dataListAnatomy,
    dataListMedia,
    dataListDetails,
    dataListCopy,
    dataListTitle,
    dataListDescription,
    dataListMeta,
    dataListActions,
    dataListPlaceholder,
  } from './data-list.variants'
  import type { DataListLayout } from './types'
  defineProps<{
    layout: DataListLayout
    title?: string | number
    description?: string | number
    mediaRatio?: number
    placeholder?: boolean
    titlePlaceholder?: boolean
    descriptionPlaceholder?: boolean
    media?: boolean
    meta?: boolean
    actions?: boolean
  }>()
  const slots = defineSlots<{
    media?(): unknown
    title?(): unknown
    description?(): unknown
    meta?(): unknown
    actions?(): unknown
  }>()
</script>
<template>
  <div :class="dataListAnatomy({ layout })">
    <div
      v-if="media || slots.media"
      :class="dataListMedia({ layout })"
      :style="mediaRatio ? { aspectRatio: mediaRatio } : undefined"
    >
      <Skeleton v-if="placeholder" :class="dataListPlaceholder({ part: 'media' })" />
      <slot v-else name="media" />
    </div>
    <div :class="dataListDetails({ layout })">
      <div :class="dataListCopy()">
        <div v-if="titlePlaceholder || slots.title || title !== undefined" :class="dataListTitle()">
          <Skeleton v-if="placeholder" :class="dataListPlaceholder({ part: 'title' })" />
          <slot v-else name="title">{{ title }}</slot>
        </div>
        <div
          v-if="descriptionPlaceholder || slots.description || description !== undefined"
          :class="dataListDescription()"
        >
          <Skeleton v-if="placeholder" :class="dataListPlaceholder({ part: 'description' })" />
          <slot v-else name="description">{{ description }}</slot>
        </div>
        <div v-if="meta || slots.meta" :class="dataListMeta()">
          <Skeleton v-if="placeholder" :class="dataListPlaceholder({ part: 'meta' })" />
          <slot v-else name="meta" />
        </div>
      </div>
      <div v-if="actions || slots.actions" :class="dataListActions({ layout })">
        <Skeleton v-if="placeholder" :class="dataListPlaceholder({ part: 'action' })" />
        <slot v-else name="actions" />
      </div>
    </div>
  </div>
</template>
