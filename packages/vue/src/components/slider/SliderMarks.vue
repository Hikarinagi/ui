<script setup lang="ts">
  import { sliderMark, sliderMarkLabels, sliderMarks } from './slider.variants'

  defineOptions({ name: 'HnSliderMarks' })

  const props = defineProps<{
    marks: Array<{ value: number; label?: string }>
    min: number
    max: number
    labels?: boolean
  }>()

  function percent(value: number) {
    const span = props.max - props.min
    return span > 0 ? ((value - props.min) / span) * 100 : 0
  }
</script>

<template>
  <span v-if="props.labels" aria-hidden="true" :class="sliderMarkLabels()">
    <span
      v-for="mark in props.marks"
      :key="mark.value"
      class="absolute top-0 flex w-0 justify-center whitespace-nowrap"
      :style="{ insetInlineStart: `${percent(mark.value)}%` }"
    >
      {{ mark.label }}
    </span>
  </span>
  <span v-else aria-hidden="true" :class="sliderMarks()">
    <span
      v-for="mark in props.marks"
      :key="mark.value"
      class="absolute top-0 flex h-0 w-0 items-center justify-center"
      :style="{ insetInlineStart: `${percent(mark.value)}%` }"
    >
      <span :class="sliderMark()" />
    </span>
  </span>
</template>
