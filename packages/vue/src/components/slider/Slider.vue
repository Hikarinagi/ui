<script setup lang="ts">
  import { injectTooltipProviderContext, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
  import { computed, ref } from 'vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import Tooltip from '../tooltip/Tooltip.vue'
  import {
    slider,
    sliderMark,
    sliderMarkLabels,
    sliderMarks,
    sliderRange,
    sliderRoot,
    sliderThumb,
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
  const tooltips = !!injectTooltipProviderContext(null)
  const dragging = ref(false)
  const hovered = ref(false)
  const ring = ref(false)
  let pointer = false

  const values = computed(() => [model.value ?? props.min])
  const text = computed(() => {
    const value = values.value[0]!
    return props.format ? props.format(value) : new Intl.NumberFormat(t.value.tag).format(value)
  })
  const hasMarkLabels = computed(() => !!props.marks?.some(mark => mark.label))
  const labelOpen = computed(
    () =>
      props.label === 'always' ||
      (!props.disabled && (hovered.value || ring.value || dragging.value)),
  )
  const position = computed(() => ({ '--hn-slider-p': String(percent(values.value[0]!) / 100) }))

  function percent(value: number) {
    const span = props.max - props.min
    return span > 0 ? ((value - props.min) / span) * 100 : 0
  }

  function release() {
    dragging.value = false
  }

  function onPointerDown(event: PointerEvent) {
    pointer = true
    if (props.disabled) return
    const root = event.currentTarget as HTMLElement
    if (!root.firstElementChild?.contains(event.target as Node)) return
    dragging.value = true
    window.addEventListener('pointerup', release, { once: true })
    window.addEventListener('pointercancel', release, { once: true })
  }

  function onFocusIn() {
    ring.value = !pointer
    pointer = false
  }
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
    @keydown="ring = true"
    @focusin="onFocusIn"
    @focusout="ring = false"
    @pointerenter="(e: PointerEvent) => (hovered = e.pointerType === 'mouse')"
    @pointerleave="hovered = false"
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
      <span v-if="props.marks?.length" aria-hidden="true" :class="sliderMarks()">
        <span
          v-for="mark in props.marks"
          :key="mark.value"
          class="absolute top-0 flex h-0 w-0 items-center justify-center"
          :style="{ insetInlineStart: `${percent(mark.value)}%` }"
        >
          <span :class="sliderMark()" />
        </span>
      </span>
      <Tooltip v-if="props.label !== 'none' && tooltips" :open="labelOpen" :content="text">
        <SliderThumb
          v-bind="$attrs"
          :data-focus-ring="ring ? '' : undefined"
          :class="sliderThumb()"
        />
      </Tooltip>
      <SliderThumb
        v-else
        v-bind="$attrs"
        :data-focus-ring="ring ? '' : undefined"
        :class="sliderThumb()"
      />
    </SliderRoot>
    <span v-if="hasMarkLabels" aria-hidden="true" :class="sliderMarkLabels()">
      <span
        v-for="mark in props.marks"
        :key="mark.value"
        class="absolute top-0 flex w-0 justify-center whitespace-nowrap"
        :style="{ insetInlineStart: `${percent(mark.value)}%` }"
      >
        {{ mark.label }}
      </span>
    </span>
  </span>
</template>
