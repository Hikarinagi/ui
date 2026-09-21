<script setup lang="ts" generic="T">
  import { computed } from 'vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import Spinner from '../spinner/Spinner.vue'
  import {
    masonry,
    masonryList,
    masonryItem,
    masonryStatus,
    masonryMeasure,
  } from './masonry.variants'
  import { useMasonry } from './composables/useMasonry'
  import type { MasonryProps, MasonrySlotProps, MasonryLayout } from './types'

  defineOptions({ name: 'HnMasonry' })
  const props = withDefaults(defineProps<MasonryProps<T>>(), { minColumnWidth: 240, gap: 'md' })
  const emit = defineEmits<{ layout: [value: MasonryLayout] }>()
  const slots = defineSlots<{
    default?(props: MasonrySlotProps<T>): unknown
    empty?(): unknown
    loading?(): unknown
    pending?(): unknown
  }>()
  const t = useUiLocale()
  const { element, list, spacing, listStyle, fixedColumns, entries, itemRef, measure, hasLayout } =
    useMasonry(props, value => emit('layout', value))
  const pending = computed(
    () => !!slots.pending && !hasLayout.value && (props.items.length > 0 || props.loading),
  )
  defineExpose({ element, measure })
</script>

<template>
  <div
    ref="element"
    data-hn-masonry
    :dir="props.dir"
    :class="cn(masonry({ gap: props.gap }), props.class)"
    :aria-busy="pending || props.loading"
  >
    <span ref="spacing" aria-hidden="true" :class="masonryMeasure()" />
    <div class="relative min-w-0">
      <ul
        ref="list"
        role="list"
        :aria-label="props.label"
        :aria-busy="pending || props.loading"
        :aria-hidden="pending ? true : undefined"
        :inert="pending ? true : undefined"
        :data-pending="pending ? '' : undefined"
        :class="masonryList()"
        :style="listStyle"
        :data-fixed-columns="fixedColumns ? '' : undefined"
      >
        <li
          v-for="entry in entries"
          :key="entry.key"
          :ref="itemRef(entry.key)"
          :class="
            cn(
              masonryItem(),
              typeof props.itemClass === 'function'
                ? props.itemClass(entry.item, entry.index)
                : props.itemClass,
            )
          "
        >
          <slot :item="entry.item" :index="entry.index" />
        </li>
      </ul>
      <div v-if="pending" data-hn-masonry-pending role="status" :aria-label="t.common.loading">
        <slot name="pending" />
      </div>
    </div>
    <div v-if="props.loading && !pending" :class="masonryStatus()" role="status">
      <slot name="loading">
        <Spinner size="sm" aria-hidden="true" />
        <span>{{ t.common.loading }}</span>
      </slot>
    </div>
    <div v-else-if="!props.items.length && !pending" :class="masonryStatus()">
      <slot name="empty">{{ props.emptyText ?? t.masonry.empty }}</slot>
    </div>
  </div>
</template>
