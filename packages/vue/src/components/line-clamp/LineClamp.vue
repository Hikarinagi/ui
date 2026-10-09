<script setup lang="ts">
  import { computed, nextTick, onMounted, onUpdated, shallowRef, useId, watch } from 'vue'
  import { useResizeObserver } from '@vueuse/core'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import Button from '../button/Button.vue'
  import {
    lineClampCount,
    measureLineClamp,
    revealLineClamp,
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
  const truncated = shallowRef(false)
  const count = computed(() => lineClampCount(props.lines))
  const clampClass = lineClampContent({ clamped: true })

  function measure() {
    if (content.value) truncated.value = measureLineClamp(content.value, clampClass)
  }

  onMounted(() => {
    measure()
    void document.fonts?.ready.then(measure)
  })
  onUpdated(measure)
  useResizeObserver(content, measure)
  watch(count, measure, { flush: 'post' })

  async function toggle() {
    expanded.value = !expanded.value
    if (expanded.value) return
    await nextTick()
    revealLineClamp(root.value)
  }
</script>

<template>
  <div ref="root" :class="cn(lineClampRoot(), props.class)">
    <div
      :id="id"
      ref="content"
      :data-expanded="expanded ? '' : undefined"
      :style="{ '--hn-line-clamp': count }"
      :class="lineClampContent({ clamped: !expanded })"
    >
      <slot />
    </div>
    <Button
      v-if="truncated"
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
