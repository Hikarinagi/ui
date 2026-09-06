<script setup lang="ts">
  import { ProgressRoot } from 'reka-ui'
  import { computed, useSlots } from 'vue'
  import { cn } from '../../lib/cn'
  import { useProgressValue, type ProgressFormat } from '../progress/composables/useProgressValue'
  import {
    ringProgress,
    ringProgressArc,
    ringProgressCenter,
    ringProgressLabel,
    ringProgressRoot,
    ringProgressSvg,
    ringProgressTrack,
    type RingProgressVariants,
  } from './ring-progress.variants'

  defineOptions({ name: 'HnRingProgress', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      value?: number | null
      max?: number
      label?: string
      showValue?: boolean
      format?: ProgressFormat
      tone?: RingProgressVariants['tone']
      size?: RingProgressVariants['size']
      class?: string
    }>(),
    { value: null, max: 100, showValue: false },
  )

  const slots = useSlots()
  const { current, text, name } = useProgressValue({
    value: () => props.value,
    max: () => props.max,
    label: () => props.label,
    format: () => props.format,
  })
  const offset = computed(() => {
    if (current.value === null) return 75
    return props.max > 0 ? 100 - (current.value * 100) / props.max : 100
  })
</script>

<template>
  <div data-hn-ring-progress :class="cn(ringProgress(), props.class)">
    <ProgressRoot
      v-bind="$attrs"
      :model-value="current"
      :max="props.max"
      :get-value-label="() => name"
      :get-value-text="props.format ? () => text : undefined"
      :class="ringProgressRoot({ size: props.size })"
    >
      <svg viewBox="0 0 100 100" aria-hidden="true" :class="ringProgressSvg()">
        <circle cx="50" cy="50" r="45" stroke-width="10" :class="ringProgressTrack()" />
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke-width="10"
          pathLength="100"
          stroke-dasharray="100"
          :stroke-dashoffset="offset"
          :stroke-linecap="offset < 100 ? 'round' : undefined"
          :class="ringProgressArc({ tone: props.tone })"
        />
      </svg>
      <div v-if="slots.default || (props.showValue && text)" :class="ringProgressCenter()">
        <slot>{{ text }}</slot>
      </div>
    </ProgressRoot>
    <span v-if="props.label" :class="ringProgressLabel()">{{ props.label }}</span>
  </div>
</template>
