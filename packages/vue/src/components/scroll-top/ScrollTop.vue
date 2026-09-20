<script setup lang="ts">
  import { ArrowUp } from '@lucide/vue'
  import { useUiLocale } from '../../locale'
  import FloatButton from '../float-button/FloatButton.vue'
  import { useScrollTop } from './composables/useScrollTop'
  import type { ScrollTopProps } from './types'

  defineOptions({ name: 'HnScrollTop', inheritAttrs: false })
  const props = withDefaults(defineProps<ScrollTopProps>(), {
    tooltip: true,
    ripple: true,
    variant: 'outline',
    tone: 'neutral',
  })
  const emit = defineEmits<{ click: [event: MouseEvent] }>()
  defineSlots<{ default?(): unknown }>()
  const t = useUiLocale()
  const { visible, scrollToTop, onFocus, onBlur } = useScrollTop(props)
  function activate(event: MouseEvent) {
    emit('click', event)
    if (!event.defaultPrevented) scrollToTop()
  }
  defineExpose({ visible, scrollToTop })
</script>

<template>
  <FloatButton
    :visible="visible"
    v-bind="$attrs"
    data-hn-scroll-top
    :label="props.label ?? t.scroll.backToTop"
    :position="props.position"
    :placement="props.placement"
    :offset="props.offset"
    :size="props.size"
    :shape="props.shape"
    :extended="props.extended"
    :variant="props.variant"
    :tone="props.tone"
    :tooltip="props.tooltip"
    :tooltip-side="props.tooltipSide"
    :disabled="props.disabled"
    :loading="props.loading"
    :ripple="props.ripple"
    :class="props.class"
    :style="props.style"
    @click="activate"
    @focus="onFocus"
    @blur="onBlur"
  >
    <slot><ArrowUp /></slot>
  </FloatButton>
</template>
