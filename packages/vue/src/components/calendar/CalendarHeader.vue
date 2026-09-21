<script setup lang="ts">
  import type { Component } from 'vue'
  import { ChevronLeft, ChevronRight } from '@lucide/vue'
  import Button from '../button/Button.vue'
  import IconButton from '../icon-button/IconButton.vue'
  import { calendarHeader, calendarHeading, type CalendarVariants } from './calendar.variants'

  defineOptions({ name: 'HnCalendarHeader' })

  const props = defineProps<{
    prev?: Component
    next?: Component
    prevDisabled?: boolean
    nextDisabled?: boolean
    prevLabel: string
    nextLabel: string
    heading: string
    pickLabel?: string
    size?: CalendarVariants['size']
    disabled?: boolean
  }>()
  const emit = defineEmits<{ pick: []; prev: []; next: [] }>()
  defineSlots<{ heading?(): unknown }>()
</script>

<template>
  <div :class="calendarHeader()">
    <component :is="props.prev" v-if="props.prev" as-child>
      <IconButton :label="props.prevLabel" :size="props.size">
        <ChevronLeft class="rtl:rotate-180" />
      </IconButton>
    </component>
    <IconButton
      v-else
      :label="props.prevLabel"
      :size="props.size"
      :disabled="props.disabled || props.prevDisabled"
      @click="emit('prev')"
    >
      <ChevronLeft class="rtl:rotate-180" />
    </IconButton>
    <slot name="heading">
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
    </slot>
    <component :is="props.next" v-if="props.next" as-child>
      <IconButton :label="props.nextLabel" :size="props.size">
        <ChevronRight class="rtl:rotate-180" />
      </IconButton>
    </component>
    <IconButton
      v-else
      :label="props.nextLabel"
      :size="props.size"
      :disabled="props.disabled || props.nextDisabled"
      @click="emit('next')"
    >
      <ChevronRight class="rtl:rotate-180" />
    </IconButton>
  </div>
</template>
