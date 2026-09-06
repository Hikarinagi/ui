<script setup lang="ts">
  import { ProgressIndicator, ProgressRoot } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { useProgressValue, type ProgressFormat } from './composables/useProgressValue'
  import {
    progress,
    progressBar,
    progressHeader,
    progressTrack,
    progressValue,
    type ProgressVariants,
  } from './progress.variants'

  defineOptions({ name: 'HnProgress', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      value?: number | null
      max?: number
      label?: string
      showValue?: boolean
      format?: ProgressFormat
      tone?: ProgressVariants['tone']
      size?: ProgressVariants['size']
      class?: string
    }>(),
    { value: null, max: 100, showValue: false },
  )

  const { current, ratio, text, name } = useProgressValue({
    value: () => props.value,
    max: () => props.max,
    label: () => props.label,
    format: () => props.format,
  })
</script>

<template>
  <div
    data-hn-progress
    :class="cn(progress(), props.class)"
    :style="{ '--hn-progress-p': String(ratio) }"
  >
    <div v-if="props.label || (props.showValue && text)" :class="progressHeader()">
      <span v-if="props.label">{{ props.label }}</span>
      <span v-if="props.showValue && text" :class="progressValue()">{{ text }}</span>
    </div>
    <ProgressRoot
      v-bind="$attrs"
      :model-value="current"
      :max="props.max"
      :get-value-label="() => name"
      :get-value-text="props.format ? () => text : undefined"
      :class="progressTrack({ size: props.size })"
    >
      <ProgressIndicator :class="progressBar({ tone: props.tone })" />
    </ProgressRoot>
  </div>
</template>
