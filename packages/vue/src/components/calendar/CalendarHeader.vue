<script setup lang="ts">
  import type { Component } from 'vue'
  import { ChevronLeft, ChevronRight } from '@lucide/vue'
  import Button from '../button/Button.vue'
  import IconButton from '../icon-button/IconButton.vue'
  import { calendarHeader, calendarHeading, type CalendarVariants } from './calendar.variants'

  defineOptions({ name: 'HnCalendarHeader' })

  const props = defineProps<{
    prev: Component
    next: Component
    prevLabel: string
    nextLabel: string
    heading: string
    pickLabel?: string
    size?: CalendarVariants['size']
    disabled?: boolean
  }>()
  const emit = defineEmits<{ pick: [] }>()
</script>

<template>
  <div :class="calendarHeader()">
    <component :is="props.prev" as-child>
      <IconButton :label="props.prevLabel" :size="props.size">
        <ChevronLeft />
      </IconButton>
    </component>
    <Button
      v-if="props.pickLabel"
      variant="ghost"
      tone="neutral"
      :size="props.size"
      :class="calendarHeading()"
      :aria-label="props.pickLabel"
      :disabled="props.disabled"
      @click="emit('pick')"
    >
      {{ props.heading }}
    </Button>
    <span v-else :class="calendarHeading({ still: true })">
      {{ props.heading }}
    </span>
    <component :is="props.next" as-child>
      <IconButton :label="props.nextLabel" :size="props.size">
        <ChevronRight />
      </IconButton>
    </component>
  </div>
</template>
