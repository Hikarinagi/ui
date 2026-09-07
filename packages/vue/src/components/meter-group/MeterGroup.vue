<script setup lang="ts">
  import { computed } from 'vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import Indicator from '../indicator/Indicator.vue'
  import type { ProgressFormat } from '../progress/composables/useProgressValue'
  import { progressTrack, type ProgressVariants } from '../progress/progress.variants'
  import {
    meterGroup,
    meterHeader,
    meterLegend,
    meterLegendItem,
    meterSegment,
    meterValue,
  } from './meter-group.variants'
  import type { MeterItem } from './types'
  import { toneAt } from './utils/tones'

  defineOptions({ name: 'HnMeterGroup', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      items: MeterItem[]
      max?: number
      label?: string
      legend?: boolean
      format?: ProgressFormat
      size?: ProgressVariants['size']
      class?: string
    }>(),
    { max: 100, legend: true },
  )

  const t = useUiLocale()

  const percent = computed(
    () => new Intl.NumberFormat(t.value.tag, { style: 'percent', maximumFractionDigits: 0 }),
  )

  function text(value: number) {
    if (props.format) return props.format(value, props.max)
    return percent.value.format(props.max > 0 ? value / props.max : 0)
  }

  const entries = computed(() =>
    props.items.map((item, index) => {
      const value = Math.min(Math.max(item.value, 0), props.max)
      const ratio = props.max > 0 ? value / props.max : 0
      return {
        ...item,
        value,
        tone: item.tone ?? toneAt(index),
        width: `${ratio * 100}%`,
        text: text(value),
      }
    }),
  )

  const total = computed(() =>
    text(
      Math.min(
        entries.value.reduce((sum, entry) => sum + entry.value, 0),
        props.max,
      ),
    ),
  )
</script>

<template>
  <div data-hn-meter-group :class="cn(meterGroup(), props.class)">
    <div v-if="props.label" :class="meterHeader()">
      <span>{{ props.label }}</span>
      <span :class="meterValue()">{{ total }}</span>
    </div>
    <div
      v-bind="$attrs"
      role="group"
      :aria-label="props.label"
      :class="cn(progressTrack({ size: props.size }), 'flex')"
    >
      <span
        v-for="entry in entries"
        :key="entry.label"
        role="meter"
        :aria-label="entry.label"
        :aria-valuenow="entry.value"
        aria-valuemin="0"
        :aria-valuemax="props.max"
        :aria-valuetext="props.format ? entry.text : undefined"
        :class="meterSegment({ tone: entry.tone })"
        :style="{ width: entry.width }"
      />
    </div>
    <div v-if="props.legend" :class="meterLegend()">
      <span v-for="entry in entries" :key="entry.label" :class="meterLegendItem()">
        <Indicator :tone="entry.tone" size="sm" />
        <span>{{ entry.label }}</span>
        <span :class="meterValue()">{{ entry.text }}</span>
      </span>
    </div>
  </div>
</template>
