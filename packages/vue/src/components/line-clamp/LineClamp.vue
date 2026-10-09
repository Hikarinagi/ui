<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, onUpdated, shallowRef, useId } from 'vue'
  import { useResizeObserver } from '@vueuse/core'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import Button from '../button/Button.vue'
  import {
    animateLineClamp,
    lineClampCount,
    lineClampSize,
    measureLineClamp,
    revealLineClamp,
    type LineClampMeasure,
  } from '../../../../shared/src/lib/line-clamp'
  import { lineClampContent, lineClampRoot } from './line-clamp.variants'

  defineOptions({ name: 'HnLineClamp' })

  const props = defineProps<{
    lines?: number
    expandLabel?: string
    collapseLabel?: string
    class?: string
  }>()

  const expanded = defineModel<boolean>('expanded', { default: false })

  const t = useUiLocale()
  const id = useId()
  const root = shallowRef<HTMLElement | null>(null)
  const content = shallowRef<HTMLElement | null>(null)
  const measured = shallowRef<LineClampMeasure | null>(null)
  const count = computed(() => lineClampCount(props.lines))

  let shown = expanded.value
  let reveal = false
  let stop: (() => void) | undefined

  function measure() {
    if (!content.value) return
    const next = measureLineClamp(content.value)
    if (!next) return
    const current = measured.value
    if (current?.size !== next.size || current.truncated !== next.truncated) measured.value = next
  }

  function sync() {
    const element = content.value
    if (element && shown !== expanded.value) {
      shown = expanded.value
      const scroll = reveal && !shown
      reveal = false
      stop?.()
      stop = animateLineClamp(element, shown, () => {
        measure()
        if (scroll) revealLineClamp(root.value)
      })
    }
    measure()
  }

  onMounted(() => {
    measure()
    void document.fonts?.ready.then(measure)
  })
  onUpdated(sync)
  useResizeObserver(content, measure)
  onBeforeUnmount(() => stop?.())

  function toggle() {
    reveal = expanded.value
    expanded.value = !expanded.value
  }
</script>

<template>
  <div ref="root" :class="cn(lineClampRoot(), props.class)">
    <div
      :id="id"
      ref="content"
      :data-expanded="expanded ? '' : undefined"
      :data-truncated="measured?.truncated ? '' : undefined"
      :style="{ '--hn-line-clamp': count, '--hn-line-clamp-size': lineClampSize(measured) }"
      :class="lineClampContent()"
    >
      <slot />
    </div>
    <Button
      v-if="measured?.truncated"
      variant="link"
      size="sm"
      :aria-expanded="expanded"
      :aria-controls="id"
      @click="toggle"
    >
      {{
        expanded
          ? (props.collapseLabel ?? t.lineClamp.collapse)
          : (props.expandLabel ?? t.lineClamp.expand)
      }}
    </Button>
  </div>
</template>
