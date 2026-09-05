<script setup lang="ts">
  import { SliderRoot, SliderTrack } from 'reka-ui'
  import { computed, toRef } from 'vue'
  import { cn } from '../../lib/cn'
  import { useFieldControl } from '../form-field/context'
  import { useUiLocale } from '../../locale'
  import { useSliderChrome } from '../slider/composables/useSliderChrome'
  import SliderHandle from '../slider/SliderHandle.vue'
  import SliderMarks from '../slider/SliderMarks.vue'
  import {
    slider,
    sliderRangeBetween,
    sliderRoot,
    sliderTrack,
    type SliderVariants,
  } from '../slider/slider.variants'

  defineOptions({ name: 'HnRangeSlider', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      min?: number
      max?: number
      step?: number
      minSteps?: number
      marks?: Array<{ value: number; label?: string }>
      label?: 'auto' | 'always' | 'none'
      format?: (value: number) => string
      size?: SliderVariants['size']
      disabled?: boolean
      class?: string
    }>(),
    { min: 0, max: 100, step: 1, minSteps: 0, label: 'auto' },
  )

  const emit = defineEmits<{ commit: [value: [number, number]] }>()

  const model = defineModel<[number, number]>()

  const t = useUiLocale()
  const { labelledBy, invalid, disabled, describedBy } = useFieldControl({
    disabled: () => props.disabled,
  })
  const { dragging, ring, labelOpen, onPointerDown, listeners } = useSliderChrome(
    disabled,
    toRef(props, 'label'),
  )

  const values = computed<[number, number]>(() => model.value ?? [props.min, props.max])
  const hasMarkLabels = computed(() => !!props.marks?.some(mark => mark.label))

  function fraction(value: number) {
    const span = props.max - props.min
    return span > 0 ? (value - props.min) / span : 0
  }

  function text(value: number) {
    return props.format ? props.format(value) : new Intl.NumberFormat(t.value.tag).format(value)
  }

  const position = computed(() => ({
    '--hn-slider-p': String(fraction(values.value[0])),
    '--hn-slider-q': String(fraction(values.value[1])),
  }))
</script>

<template>
  <span
    data-hn-range-slider
    data-hn-state-group
    role="group"
    v-bind="$attrs"
    :aria-labelledby="labelledBy"
    :aria-describedby="describedBy"
    :aria-invalid="invalid || undefined"
    :data-disabled="disabled ? '' : undefined"
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
      :min-steps-between-thumbs="props.minSteps"
      :disabled="disabled"
      :class="sliderRoot()"
      @update:model-value="value => (model = [value![0]!, value![1]!])"
      @value-commit="value => emit('commit', [value[0]!, value[1]!])"
    >
      <SliderTrack :class="sliderTrack()">
        <span :class="sliderRangeBetween()" />
      </SliderTrack>
      <SliderMarks
        v-if="props.marks?.length"
        :marks="props.marks"
        :min="props.min"
        :max="props.max"
      />
      <SliderHandle
        :aria-label="t.slider.minimum"
        :style="{ '--hn-slider-p': String(fraction(values[0])) }"
        :text="text(values[0])"
        :open="labelOpen"
        :ring="ring"
        :tooltip="props.label !== 'none'"
      />
      <SliderHandle
        :aria-label="t.slider.maximum"
        :style="{ '--hn-slider-p': String(fraction(values[1])) }"
        :text="text(values[1])"
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
