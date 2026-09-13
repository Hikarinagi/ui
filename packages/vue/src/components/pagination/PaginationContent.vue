<script setup lang="ts">
  import { shallowRef } from 'vue'
  import { PaginationList } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import PaginationPages from './PaginationPages.vue'
  import { paginationList } from './pagination.variants'
  defineOptions({ name: 'HnPaginationContent' })
  const props = defineProps<{ class?: string }>()
  defineSlots<{
    page?(props: { page: number; selected: boolean }): unknown
    ellipsis?(props: { side: 'prev' | 'next'; expanded: boolean }): unknown
  }>()
  const host = shallowRef<HTMLElement>()
</script>

<template>
  <PaginationList v-slot="{ items }" as-child>
    <ul ref="host" data-hn-pagination-content :class="cn(paginationList(), props.class)">
      <PaginationPages :items="items" :host="host">
        <template v-if="$slots.page" #page="slotProps">
          <slot name="page" v-bind="slotProps" />
        </template>
        <template v-if="$slots.ellipsis" #ellipsis="slotProps">
          <slot name="ellipsis" v-bind="slotProps" />
        </template>
      </PaginationPages>
    </ul>
  </PaginationList>
</template>
