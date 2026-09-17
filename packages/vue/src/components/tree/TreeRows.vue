<script setup lang="ts" generic="T extends { label: string; disabled?: boolean }">
  import { shallowRef, watch } from 'vue'
  import type { FlattenedItem } from 'reka-ui'
  import type { VirtualizeOptions } from '../../lib/virtual/types'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import VirtualTreeWindow from './VirtualTreeWindow.vue'

  const props = defineProps<{
    items: FlattenedItem<T>[]
    virtualize?: VirtualizeOptions
    maxHeight?: string | number
    scrollable?: boolean
    class?: string
    disabled?: (node: T) => boolean
  }>()
  defineSlots<{ default(props: { item: FlattenedItem<T> }): unknown; empty?(): unknown }>()
  const area = shallowRef<InstanceType<typeof ScrollArea>>()
  watch(
    () => area.value?.viewport,
    viewport => viewport?.setAttribute('role', 'group'),
    { flush: 'post' },
  )
  const window = shallowRef<{
    focusFirst(): void
    focusLast(): void
    isFirst(element: EventTarget | null): boolean
  }>()
  defineExpose({
    focusFirst: () => window.value?.focusFirst(),
    focusLast: () => window.value?.focusLast(),
    isFirst: (element: EventTarget | null) => window.value?.isFirst(element) ?? false,
  })
</script>

<template>
  <ScrollArea
    v-if="props.virtualize || props.scrollable"
    ref="area"
    :class="props.class"
    :style="{
      maxHeight: typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight,
    }"
  >
    <VirtualTreeWindow
      v-if="props.virtualize"
      ref="window"
      :items="props.items"
      :virtualize="props.virtualize"
      :viewport="area?.viewport"
      :disabled="props.disabled"
      v-slot="{ item }"
    >
      <slot :item="item" />
    </VirtualTreeWindow>
    <template v-else v-for="item in props.items" :key="item._id"><slot :item="item" /></template>
    <slot v-if="!props.items.length" name="empty" />
  </ScrollArea>
  <template v-else v-for="item in props.items" :key="item._id"><slot :item="item" /></template>
</template>
