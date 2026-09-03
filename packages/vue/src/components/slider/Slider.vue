<script setup lang="ts">
  import { SliderRoot, SliderTrack } from 'reka-ui'
  import { computed, toRef } from 'vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import { useSliderChrome } from './composables/useSliderChrome'
  import SliderHandle from './SliderHandle.vue'
  import SliderMarks from './SliderMarks.vue'
  import {
    slider,
    sliderRange,
    sliderRoot,
    sliderTrack,
    type SliderVariants,
  } from './slider.variants'

  defineOptions({ name: 'HnSlider', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      min?: number
      max?: number
      step?: number
      marks?: Array<{ value: number; label?: string }>
      label?: 'auto' | 'always' | 'none'
      format?: (value: number) => string
      size?: SliderVariants['size']
      disabled?: boolean
      class?: string
    }>(),
    { min: 0, max: 100, step: 1, label: 'auto' },
  )

  const emit = defineEmits<{ commit: [value: number] }>()

  const model = defineModel<number>()

  const t = useUiLocale()
  const { dragging, ring, labelOpen, onPointerDown, listeners } = useSliderChrome(
    toRef(props, 'disabled'),
    toRef(props, 'label'),
  )

  const values = computed(() => [model.value ?? props.min])
  const text = computed(() => {
    const value = values.value[0]!
    return props.format ? props.format(value) : new Intl.NumberFormat(t.value.tag).format(value)
  })
  const hasMarkLabels = computed(() => !!props.marks?.some(mark => mark.label))
  const position = computed(() => {
    const span = props.max - props.min
    const p = span > 0 ? (values.value[0]! - props.min) / span : 0
    return { '--hn-slider-p': String(p) }
  })
</script>

<template>
  <span
    data-hn-slider
    data-hn-state-group
    :data-disabled="props.disabled ? '' : undefined"
    :data-dragging="dragging ? '' : undefined"
    :style="position"
    :class="cn(slider({ size: props.size }), props.class)"
    @pointerdown.capture="onPointerDown"
    v-on="listeners"
  >
    <SliderRoot
      :model-value="values"
      :min="props.min"
      :max="props.max"
      :step="props.step"
      :disabled="props.disabled"
      :class="sliderRoot()"
      @update:model-value="value => (model = value?.[0])"
      @value-commit="value => emit('commit', value[0]!)"
    >
      <SliderTrack :class="sliderTrack()">
        <span :class="sliderRange()" />
      </SliderTrack>
      <SliderMarks
        v-if="props.marks?.length"
        :marks="props.marks"
        :min="props.min"
        :max="props.max"
      />
      <SliderHandle
        v-bind="$attrs"
        :text="text"
        :open="labelOpen"
        :ring="ring"
        :tooltip="props.label !== 'none'"
      />
    </SliderRoot>
    <SliderMarks
      v-if="hasMarkLabels"
      :marks="props.marks!"
      :min="props.min"
      :max="props.max"
      labels
    />
  </span>
</template>
