<script setup lang="ts">
  import { toRef } from 'vue'
  import { PaginationListItem } from 'reka-ui'
  import Button from '../button/Button.vue'
  import { useUiLocale } from '../../locale'
  import { usePaginationContext } from './context'
  import PaginationControl from './PaginationControl.vue'
  import PaginationEllipsis from './PaginationEllipsis.vue'
  import PaginationPopup from './PaginationPopup.vue'
  import { paginationItem } from './pagination.variants'
  import { usePaginationEllipsis } from './composables/usePaginationEllipsis'
  import type { PaginationEntry } from './types'
  defineOptions({ name: 'HnPaginationPages' })
  const props = defineProps<{ items: PaginationEntry[]; host?: HTMLElement }>()
  const { state, size, direction, showFirstLast } = usePaginationContext()
  const t = useUiLocale()
  const ellipsis = usePaginationEllipsis(toRef(props, 'host'), () => props.items)
</script>

<template>
  <li v-if="showFirstLast"><PaginationControl action="first" :size="size" :dir="direction" /></li>
  <li><PaginationControl action="prev" :size="size" :dir="direction" /></li>
  <li
    v-for="(item, index) in props.items"
    :key="item.type === 'page' ? item.value : 'ellipsis-' + (index === 1 ? 'prev' : 'next')"
  >
    <PaginationListItem v-if="item.type === 'page'" :value="item.value" as-child>
      <Button
        variant="ghost"
        tone="neutral"
        :size="size"
        :aria-label="t.pagination.pageLabel(item.value)"
        :class="paginationItem({ size, selected: item.value === state.page })"
      >
        <slot name="page" :page="item.value" :selected="item.value === state.page">
          {{ item.value }}
        </slot>
      </Button>
    </PaginationListItem>
    <PaginationEllipsis
      v-else-if="
        ellipsis.ranges.value.find(range => range.side === (index === 1 ? 'prev' : 'next'))
      "
      :range="ellipsis.ranges.value.find(range => range.side === (index === 1 ? 'prev' : 'next'))!"
      :controller="ellipsis"
    >
      <template v-if="$slots.ellipsis" #default="slotProps">
        <slot name="ellipsis" v-bind="slotProps" />
      </template>
    </PaginationEllipsis>
  </li>
  <li><PaginationControl action="next" :size="size" :dir="direction" /></li>
  <li v-if="showFirstLast"><PaginationControl action="last" :size="size" :dir="direction" /></li>
  <PaginationPopup :controller="ellipsis" />
</template>
