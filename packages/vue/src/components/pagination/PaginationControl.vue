<script setup lang="ts">
  import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from '@lucide/vue'
  import { PaginationFirst, PaginationPrev, PaginationNext, PaginationLast } from 'reka-ui'
  import { useUiLocale } from '../../locale'
  import Button from '../button/Button.vue'
  import type { ButtonVariants } from '../button/button.variants'
  import { paginationArrow } from './pagination.variants'

  defineOptions({ name: 'HnPaginationControl' })

  const props = defineProps<{
    action: 'first' | 'prev' | 'next' | 'last'
    size?: ButtonVariants['size']
    dir: 'ltr' | 'rtl'
  }>()
  const t = useUiLocale()
  const controls = {
    first: { component: PaginationFirst, icon: ChevronsLeft },
    prev: { component: PaginationPrev, icon: ChevronLeft },
    next: { component: PaginationNext, icon: ChevronRight },
    last: { component: PaginationLast, icon: ChevronsRight },
  }
</script>

<template>
  <component :is="controls[props.action].component" as-child>
    <Button
      variant="ghost"
      tone="neutral"
      :size="props.size"
      icon-only
      :aria-label="t.pagination[props.action]"
      :data-hn-pagination-action="props.action"
    >
      <component
        :is="controls[props.action].icon"
        aria-hidden="true"
        :class="paginationArrow({ dir: props.dir })"
      />
    </Button>
  </component>
</template>
