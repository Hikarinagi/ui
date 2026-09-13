<script setup lang="ts">
  import { toRef } from 'vue'
  import { usePaginationContext } from './context'
  import PaginationControl from './PaginationControl.vue'
  import PaginationPage from './PaginationPage.vue'
  import PaginationEllipsis from './PaginationEllipsis.vue'
  import PaginationPopup from './PaginationPopup.vue'
  import { usePaginationEllipsis } from './composables/usePaginationEllipsis'
  import type { PaginationEntry } from './types'
  defineOptions({ name: 'HnPaginationPages' })
  const props = defineProps<{ items: PaginationEntry[]; host?: HTMLElement }>()
  const { size, direction, showFirstLast } = usePaginationContext()
  const ellipsis = usePaginationEllipsis(toRef(props, 'host'), () => props.items)
</script>

<template>
  <li v-if="showFirstLast"><PaginationControl action="first" :size="size" :dir="direction" /></li>
  <li><PaginationControl action="prev" :size="size" :dir="direction" /></li>
  <li
    v-for="(item, index) in props.items"
    :key="item.type === 'page' ? item.value : 'ellipsis-' + (index === 1 ? 'prev' : 'next')"
  >
    <PaginationPage v-if="item.type === 'page'" :page="item.value">
      <template v-if="$slots.page" #default="slotProps">
        <slot name="page" v-bind="slotProps" />
      </template>
    </PaginationPage>
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
