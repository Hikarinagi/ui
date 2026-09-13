<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import { usePaginationContext } from './context'
  defineOptions({ name: 'HnPaginationInfo' })
  const props = defineProps<{ class?: string }>()
  const { state } = usePaginationContext()
  const t = useUiLocale()
</script>

<template>
  <p data-hn-pagination-info :class="cn('text-muted max-w-full text-sm tabular-nums', props.class)">
    <slot v-bind="state">
      {{ t.pagination.rangeLabel(state.from, state.to, state.total) }} ·
      {{ t.pagination.pageCountLabel(state.page, state.pageCount) }}
    </slot>
  </p>
</template>
