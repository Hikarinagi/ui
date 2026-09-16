<script setup lang="ts" generic="T extends TimelineItem = TimelineItem">
  import { computed } from 'vue'
  import { cn } from '../../lib/cn'
  import { timeline, timelineMarker } from './timeline.variants'
  import type {
    TimelineAlign,
    TimelineItem,
    TimelineOrientation,
    TimelineSize,
    TimelineSlotProps,
    TimelineTone,
  } from './types'

  defineOptions({ name: 'HnTimeline' })

  const props = withDefaults(
    defineProps<{
      items: T[]
      orientation?: TimelineOrientation
      align?: TimelineAlign
      size?: TimelineSize
      tone?: TimelineTone
      timePosition?: 'content' | 'opposite'
      reverse?: boolean
      class?: string
    }>(),
    { orientation: 'vertical', align: 'start', timePosition: 'content', reverse: false },
  )

  const slots = defineSlots<{
    marker?(props: TimelineSlotProps<T>): unknown
    title?(props: TimelineSlotProps<T>): unknown
    description?(props: TimelineSlotProps<T>): unknown
    time?(props: TimelineSlotProps<T>): unknown
    content?(props: TimelineSlotProps<T>): unknown
    opposite?(props: TimelineSlotProps<T>): unknown
  }>()

  const entries = computed(() => (props.reverse ? [...props.items].reverse() : props.items))
  function hasOpposite() {
    return (
      !!slots.opposite ||
      (props.timePosition === 'opposite' && (!!slots.time || props.items.some(item => item.time)))
    )
  }
</script>

<template>
  <ol
    data-hn-timeline
    role="list"
    :data-orientation="props.orientation"
    :data-align="props.align"
    :data-opposite="hasOpposite() || undefined"
    :class="cn(timeline({ size: props.size }), props.class)"
  >
    <li
      v-for="(item, index) in entries"
      :key="item.id ?? index"
      class="hn-timeline-item min-w-0"
      :data-side="
        props.align === 'end' || (props.align === 'alternate' && index % 2 === 1) ? 'end' : 'start'
      "
    >
      <div v-if="hasOpposite()" class="hn-timeline-opposite text-muted min-w-0 wrap-anywhere">
        <slot name="opposite" :item="item" :index="index">
          <slot v-if="props.timePosition === 'opposite'" name="time" :item="item" :index="index">
            <component
              :is="item.dateTime ? 'time' : 'span'"
              v-if="item.time"
              :datetime="item.dateTime"
              class="text-xs tabular-nums"
            >
              {{ item.time }}
            </component>
          </slot>
        </slot>
      </div>
      <div class="hn-timeline-separator" aria-hidden="true">
        <span :class="timelineMarker({ tone: item.tone ?? props.tone })">
          <slot name="marker" :item="item" :index="index">
            <span class="bg-surface size-2.5 rounded-full border-2 border-current" />
          </slot>
        </span>
        <span v-if="index < entries.length - 1" class="hn-timeline-connector bg-line" />
      </div>
      <div class="hn-timeline-content min-w-0 wrap-anywhere">
        <slot name="content" :item="item" :index="index">
          <div
            v-if="props.timePosition === 'content' && (item.time || slots.time)"
            class="text-muted mb-1 text-xs tabular-nums"
          >
            <slot name="time" :item="item" :index="index">
              <component :is="item.dateTime ? 'time' : 'span'" :datetime="item.dateTime">
                {{ item.time }}
              </component>
            </slot>
          </div>
          <div v-if="item.title || slots.title" class="font-medium">
            <slot name="title" :item="item" :index="index">{{ item.title }}</slot>
          </div>
          <div v-if="item.description || slots.description" class="text-muted mt-1">
            <slot name="description" :item="item" :index="index">{{ item.description }}</slot>
          </div>
        </slot>
      </div>
    </li>
  </ol>
</template>
