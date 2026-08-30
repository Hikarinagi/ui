<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
  import { OverlayScrollbars, type OverlayScrollbars as OSInstance } from 'overlayscrollbars'
  import 'overlayscrollbars/overlayscrollbars.css'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'

  defineOptions({ name: 'HnScrollArea', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      direction?: 'vertical' | 'horizontal' | 'both'
      autoHide?: 'never' | 'scroll' | 'leave' | 'move'
      shadow?: boolean
      focusable?: boolean
      label?: string
      class?: string
    }>(),
    { direction: 'vertical', autoHide: 'leave', shadow: true, focusable: false },
  )

  const t = useUiLocale()
  const host = shallowRef<HTMLElement>()
  const viewport = shallowRef<HTMLElement>()
  const instance = shallowRef<OSInstance>()

  const edgeOffset = 0
  const edge = shallowRef<'start' | 'end' | 'both' | undefined>()

  function updateEdges() {
    const el = viewport.value
    if (!el || !props.shadow || props.direction === 'both') {
      edge.value = undefined
      return
    }
    const vertical = props.direction === 'vertical'
    const scrollStart = vertical ? el.scrollTop : Math.abs(el.scrollLeft)
    const scrollSize = vertical ? el.scrollHeight : el.scrollWidth
    const clientSize = vertical ? el.clientHeight : el.clientWidth

    const hasScrollBefore = scrollStart > edgeOffset
    const hasScrollAfter = scrollStart + clientSize + edgeOffset < scrollSize - 1

    edge.value =
      hasScrollBefore && hasScrollAfter
        ? 'both'
        : hasScrollBefore
          ? 'start'
          : hasScrollAfter
            ? 'end'
            : undefined
  }

  const showStart = computed(() => edge.value === 'start' || edge.value === 'both')
  const showEnd = computed(() => edge.value === 'end' || edge.value === 'both')
  const axis = computed(() => (props.direction === 'horizontal' ? 'x' : 'y'))

  const overflow = {
    vertical: { x: 'hidden', y: 'scroll' },
    horizontal: { x: 'scroll', y: 'hidden' },
    both: { x: 'scroll', y: 'scroll' },
  } as const

  function options() {
    return {
      scrollbars: {
        theme: 'os-theme-dark',
        autoHide: props.autoHide,
        autoHideDelay: 800,
      },
      overflow: overflow[props.direction],
    }
  }

  let contentResize: ResizeObserver | undefined

  function observeContent() {
    const vp = viewport.value
    if (!vp || !contentResize) return
    contentResize.disconnect()
    for (const child of Array.from(vp.children)) contentResize.observe(child)
  }

  onMounted(() => {
    if (!host.value) return
    instance.value = OverlayScrollbars(host.value, options())
    viewport.value = instance.value.elements().viewport
    contentResize = new ResizeObserver(() => instance.value?.update(true))
    instance.value.on('scroll', updateEdges)
    instance.value.on('updated', () => {
      observeContent()
      updateEdges()
    })
    observeContent()
    updateEdges()
  })

  watch(
    () => [props.direction, props.autoHide],
    () => instance.value?.options(options()),
  )

  watch(() => [props.shadow, props.direction], updateEdges)

  onBeforeUnmount(() => {
    contentResize?.disconnect()
    contentResize = undefined
    instance.value?.destroy()
    instance.value = undefined
    viewport.value = undefined
  })

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
      <slot />
    </div>
    <template v-if="props.shadow && props.direction !== 'both'">
      <div
        class="hn-scroll-shadow"
        :data-side="`${axis}-start`"
        :data-visible="showStart ? '' : undefined"
        aria-hidden="true"
      />
      <div
        class="hn-scroll-shadow"
        :data-side="`${axis}-end`"
        :data-visible="showEnd ? '' : undefined"
        aria-hidden="true"
      />
    </template>
  </div>
</template>
