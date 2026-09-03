<script setup lang="ts">
  import { injectTooltipProviderContext, SliderThumb } from 'reka-ui'
  import Tooltip from '../tooltip/Tooltip.vue'
  import { sliderThumb } from './slider.variants'

  defineOptions({ name: 'HnSliderHandle', inheritAttrs: false })

  const props = defineProps<{ text: string; open: boolean; ring: boolean; tooltip: boolean }>()

  const tooltips = !!injectTooltipProviderContext(null)
</script>

<template>
  <Tooltip v-if="props.tooltip && tooltips" :open="props.open" :content="props.text">
    <SliderThumb
      v-bind="$attrs"
      :data-focus-ring="props.ring ? '' : undefined"
      :class="sliderThumb()"
    />
  </Tooltip>
  <SliderThumb
    v-else
    v-bind="$attrs"
    :data-focus-ring="props.ring ? '' : undefined"
    :class="sliderThumb()"
  />
</template>
