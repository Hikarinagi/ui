<script setup lang="ts">
  import { computed, onBeforeUnmount, shallowRef, watch } from 'vue'
  import { Motion } from 'motion-v'
  import { cn } from '../../lib/cn'
  import { TRANSITION } from '../../motion'

  defineOptions({ name: 'HnHighlight' })

  const props = withDefaults(
    defineProps<{
      target?: HTMLElement | null
      until?: HTMLElement | null
      axis?: 'x' | 'y' | 'both'
      class?: string
    }>(),
    { target: null, until: null, axis: 'both' },
  )

  const box = shallowRef<{ top: number; left: number; width: number; height: number }>()

  let ro: ResizeObserver | undefined

  function measure() {
    const start = props.target
    if (!start) {
      box.value = undefined
      return
    }
    const end = props.until ?? start
    const top = Math.min(start.offsetTop, end.offsetTop)
    const left = Math.min(start.offsetLeft, end.offsetLeft)
    const bottom = Math.max(start.offsetTop + start.offsetHeight, end.offsetTop + end.offsetHeight)
    const right = Math.max(start.offsetLeft + start.offsetWidth, end.offsetLeft + end.offsetWidth)
    box.value = { top, left, width: right - left, height: bottom - top }
  }

  watch(
    () => [props.target, props.until] as const,
    ([start, end]) => {
      ro?.disconnect()
      ro = undefined
      measure()
      if (start) {
        ro = new ResizeObserver(measure)
        ro.observe(start)
        if (end && end !== start) ro.observe(end)
      }
    },
    { immediate: true, flush: 'post' },
  )

  onBeforeUnmount(() => ro?.disconnect())

  const animateTo = computed(() => {
    if (!box.value) return undefined
    const target: Record<string, string> = {}
    if (props.axis !== 'x') {
      target.top = `${box.value.top}px`
      target.height = `${box.value.height}px`
    }
    if (props.axis !== 'y') {
      target.left = `${box.value.left}px`
      target.width = `${box.value.width}px`
    }
    return target
  })

  const transition = computed(() =>
    box.value && matchMedia('(prefers-reduced-motion: reduce)').matches
      ? { duration: 0 }
      : TRANSITION.layout,
  )
</script>

<template>
  <Motion
    v-if="animateTo"
    aria-hidden="true"
    :initial="false"
    :animate="animateTo"
    :transition="transition"
    :class="cn('pointer-events-none absolute', props.class)"
  />
</template>
