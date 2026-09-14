<script setup lang="ts">
  import { computed, type ComponentPublicInstance } from 'vue'
  import { ChevronLeft, ChevronRight, MoreHorizontal } from '@lucide/vue'
  import Button from '../button/Button.vue'
  import { useUiLocale } from '../../locale'
  import { usePaginationContext } from './context'
  import { paginationArrow } from './pagination.variants'
  import type { PaginationRange } from './types'
  import type { PaginationEllipsisController } from './composables/usePaginationEllipsis'
  defineOptions({ name: 'HnPaginationEllipsis' })
  const props = defineProps<{ range: PaginationRange; controller: PaginationEllipsisController }>()
  const { size, blocked, direction, siblingCount } = usePaginationContext()
  const t = useUiLocale()
  const expanded = computed(
    () => props.controller.open.value && props.controller.active.value === props.range.side,
  )
  const register = (element: Element | ComponentPublicInstance | null) =>
    props.controller.register(props.range.side, element)
  const step = computed(() => siblingCount.value * 2 + 1)
</script>

<template>
  <Button
    :ref="register"
    variant="ghost"
    tone="neutral"
    icon-only
    :size="size"
    :disabled="blocked"
    data-hn-pagination-ellipsis
    data-type="ellipsis"
    :data-side="props.range.side"
    aria-haspopup="dialog"
    :aria-expanded="expanded"
    :aria-controls="expanded ? props.controller.id : undefined"
    :aria-label="
      props.range.side === 'prev'
        ? t.pagination.previousPagesLabel(step)
        : t.pagination.nextPagesLabel(step)
    "
    :aria-description="t.pagination.choosePageHint"
    aria-keyshortcuts="ArrowDown ArrowUp"
    @pointerdown="props.controller.pointerdown"
    @pointerenter="props.controller.enter(props.range.side, $event)"
    @pointerleave="props.controller.leave"
    @focus="props.controller.focus(props.range.side)"
    @keydown="props.controller.keydown(props.range.side, $event)"
    @click="props.controller.click(props.range.side)"
  >
    <slot :side="props.range.side" :expanded="expanded">
      <span class="grid" aria-hidden="true">
        <MoreHorizontal
          class="hn-transition-base [grid-area:1/1]"
          :class="expanded ? 'scale-90 opacity-0' : 'scale-100 opacity-100'"
        />
        <component
          :is="props.range.side === 'prev' ? ChevronLeft : ChevronRight"
          :class="[
            paginationArrow({ dir: direction }),
            expanded ? 'scale-100 opacity-100' : 'scale-90 opacity-0',
          ]"
          class="hn-transition-base [grid-area:1/1]"
        />
      </span>
    </slot>
  </Button>
</template>
