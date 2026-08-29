<script setup lang="ts">
  import { onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
  import { OverlayScrollbars, type OverlayScrollbars as OSInstance } from 'overlayscrollbars'
  import 'overlayscrollbars/overlayscrollbars.css'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'

  defineOptions({ name: 'HnScrollArea', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      direction?: 'vertical' | 'horizontal' | 'both'
      autoHide?: 'never' | 'scroll' | 'leave' | 'move'
      focusable?: boolean
      label?: string
      class?: string
    }>(),
    { direction: 'vertical', autoHide: 'leave', focusable: false },
  )

  const t = useUiLocale()
  const host = shallowRef<HTMLElement>()
  const viewport = shallowRef<HTMLElement>()
  const instance = shallowRef<OSInstance>()

  const overflow = {
    vertical: { x: 'hidden', y: 'scroll' },
    horizontal: { x: 'scroll', y: 'hidden' },
    both: { x: 'scroll', y: 'scroll' },
  } as const

  function options() {
    return {
      scrollbars: {
        theme: 'os-theme-hina',
        autoHide: props.autoHide,
        autoHideDelay: 800,
      },
      overflow: overflow[props.direction],
    }
  }

  onMounted(() => {
    if (!host.value) return
    instance.value = OverlayScrollbars(host.value, options())
    viewport.value = instance.value.elements().viewport
  })

  watch(
    () => [props.direction, props.autoHide],
    () => instance.value?.options(options()),
  )

  onBeforeUnmount(() => {
    instance.value?.destroy()
    instance.value = undefined
    viewport.value = undefined
  })

  defineExpose({ viewport, instance })
</script>

<template>
  <div
    ref="host"
    v-bind="$attrs"
    data-overlayscrollbars-initialize
    :tabindex="props.focusable ? 0 : undefined"
    :role="props.focusable ? 'region' : undefined"
    :aria-label="props.focusable ? (props.label ?? t.scroll.regionLabel) : undefined"
    :class="cn('hn-scroll-area', props.class)"
  >
    <slot />
  </div>
</template>
