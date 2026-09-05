<script setup lang="ts">
  import { computed, shallowRef, watch } from 'vue'
  import 'overlayscrollbars/overlayscrollbars.css'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import { useOverlayScrollbars } from './composables/useOverlayScrollbars'
  import { useEdgeShadow } from './composables/useEdgeShadow'
  import { useWheelRedirect } from './composables/useWheelRedirect'
  import { useLayerLock } from './composables/useLayerLock'

  defineOptions({ name: 'HnScrollArea', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      direction?: 'vertical' | 'horizontal' | 'both'
      autoHide?: 'never' | 'scroll' | 'leave' | 'move'
      scrollbar?: boolean
      wheelRedirect?: boolean
      shadow?: boolean
      focusable?: boolean
      label?: string
      class?: string
    }>(),
    {
      direction: 'vertical',
      autoHide: 'leave',
      scrollbar: true,
      wheelRedirect: true,
      shadow: true,
      focusable: false,
    },
  )

  const t = useUiLocale()
  const host = shallowRef<HTMLElement>()
  const content = shallowRef<HTMLElement>()

  const overflow = {
    vertical: { x: 'hidden', y: 'scroll' },
    horizontal: { x: 'scroll', y: 'hidden' },
    both: { x: 'scroll', y: 'scroll' },
  } as const

  function options() {
    return {
      scrollbars: {
        theme: 'os-theme-dark',
        visibility: props.scrollbar ? ('auto' as const) : ('hidden' as const),
        autoHide: props.autoHide,
        autoHideDelay: 800,
      },
      overflow: overflow[props.direction],
      update: {
        elementEvents: [
          ['img', 'load'],
          ['*', 'transitionend animationend'],
        ] as Array<[string, string]>,
      },
    }
  }

  const { viewport, instance, onEvent } = useOverlayScrollbars(host, content, options)
  const { showXStart, showXEnd, showYStart, showYEnd, updateEdges } = useEdgeShadow(
    viewport,
    () => ({ direction: props.direction, shadow: props.shadow }),
  )

  onEvent('scroll', updateEdges)
  onEvent('updated', updateEdges)
  watch(viewport, () => updateEdges())

  useWheelRedirect(viewport, () => props.direction === 'horizontal' && props.wheelRedirect)
  useLayerLock(viewport)

  watch(
    () => [props.direction, props.autoHide, props.scrollbar],
    () => instance.value?.options(options()),
  )

  defineExpose({ viewport, instance })
</script>

<template>
  <div :class="cn('hn-scroll-area relative flex flex-col overflow-hidden', props.class)">
    <div
      ref="host"
      v-bind="$attrs"
      data-overlayscrollbars-initialize
      :tabindex="props.focusable ? 0 : undefined"
      :role="props.focusable ? 'region' : undefined"
      :aria-label="props.focusable ? (props.label ?? t.scroll.regionLabel) : undefined"
      class="w-full min-h-0 grow"
    >
      <div ref="content" data-overlayscrollbars-contents>
        <slot />
      </div>
    </div>
    <template v-if="props.shadow">
      <div
        v-if="props.direction !== 'vertical'"
        class="hn-scroll-shadow"
        data-side="x-start"
        :data-visible="showXStart ? '' : undefined"
        aria-hidden="true"
      />
      <div
        v-if="props.direction !== 'vertical'"
        class="hn-scroll-shadow"
        data-side="x-end"
        :data-visible="showXEnd ? '' : undefined"
        aria-hidden="true"
      />
      <div
        v-if="props.direction !== 'horizontal'"
        class="hn-scroll-shadow"
        data-side="y-start"
        :data-visible="showYStart ? '' : undefined"
        aria-hidden="true"
      />
      <div
        v-if="props.direction !== 'horizontal'"
        class="hn-scroll-shadow"
        data-side="y-end"
        :data-visible="showYEnd ? '' : undefined"
        aria-hidden="true"
      />
    </template>
  </div>
</template>
