<script setup lang="ts">
  import { computed, shallowRef } from 'vue'
  import { cn } from '../../lib/cn'
  import Button from '../button/Button.vue'
  import { vTooltip } from '../tooltip/directive'
  import { floatButton } from './float-button.variants'
  import type { FloatButtonProps } from './types'

  defineOptions({ name: 'HnFloatButton', inheritAttrs: false })
  const props = withDefaults(defineProps<FloatButtonProps>(), {
    as: 'button',
    type: 'button',
    position: 'fixed',
    placement: 'bottom-end',
    size: 'md',
    shape: 'circle',
    variant: 'solid',
    tone: 'accent',
    tooltip: true,
    tooltipSide: 'top',
    ripple: true,
    visible: true,
  })
  defineSlots<{ default(): unknown }>()
  const button = shallowRef<InstanceType<typeof Button>>()
  const tooltip = computed(() =>
    props.tooltip && !props.extended ? { content: props.label, side: props.tooltipSide } : false,
  )
  const offset = computed(() =>
    props.offset === undefined
      ? undefined
      : typeof props.offset === 'number'
        ? Number.isFinite(props.offset)
          ? `${Math.max(0, props.offset)}px`
          : undefined
        : props.offset,
  )
  const element = computed(() => button.value?.$el as HTMLElement | undefined)
  function focus() {
    if (!props.disabled && !props.loading) element.value?.focus({ preventScroll: true })
  }
  function enter(element: Element) {
    element.removeAttribute('inert')
  }
  function leave(element: Element) {
    element.setAttribute('inert', '')
  }
  defineExpose({ element, focus })
</script>

<template>
  <Transition
    enter-active-class="hn-transition-base"
    enter-from-class="scale-90 opacity-0"
    leave-active-class="hn-transition pointer-events-none"
    leave-to-class="scale-90 opacity-0"
    @before-enter="enter"
    @before-leave="leave"
    @leave-cancelled="enter"
  >
    <Button
      v-if="props.visible"
      v-tooltip="tooltip"
      ref="button"
      v-bind="$attrs"
      data-hn-float-button
      :as="props.as"
      :type="props.type"
      :icon-only="!props.extended"
      :aria-label="props.label"
      :variant="props.variant"
      :tone="props.tone"
      :loading="props.loading"
      :disabled="props.disabled || !props.visible"
      :ripple="props.ripple"
      :data-position="props.position"
      :data-placement="props.placement"
      :class="
        cn(
          floatButton({
            position: props.position,
            size: props.size,
            shape: props.shape,
            extended: props.extended,
            variant: props.variant,
          }),
          props.class,
        )
      "
      :style="[{ '--hn-float-offset': offset }, props.style]"
    >
      <template v-if="props.extended" #icon><slot /></template>
      <span v-if="props.extended" class="min-w-0 truncate">{{ props.label }}</span>
      <slot v-else />
    </Button>
  </Transition>
</template>
