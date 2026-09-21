<script setup lang="ts">
  import { ChevronLeft, ChevronRight } from '@lucide/vue'
  import { useUiLocale } from '../../locale'
  import Button from '../button/Button.vue'
  import Pagination from '../pagination/Pagination.vue'
  import Text from '../text/Text.vue'
  import { dataListPagination } from './data-list.variants'
  import type { DataListState } from './types'

  defineProps<{ state: DataListState<unknown> }>()
  const t = useUiLocale()
</script>

<template>
  <Pagination
    v-if="state.total !== undefined"
    :model-value="state.page"
    :page-size="state.pageSize"
    :total="state.total"
    :pending="state.loading"
    align="end"
    @update:model-value="state.setPage"
  />
  <nav v-else :aria-label="t.pagination.navLabel" :class="dataListPagination()">
    <Button
      icon-only
      size="md"
      variant="ghost"
      tone="neutral"
      :disabled="state.loading || !state.hasPreviousPage"
      :aria-label="t.pagination.prev"
      @click="state.setPage(state.page - 1)"
    >
      <ChevronLeft class="rtl:rotate-180" />
    </Button>
    <Text size="sm" aria-current="page" :aria-label="t.pagination.pageLabel(state.page)">
      {{ state.page }}
    </Text>
    <Button
      icon-only
      size="md"
      variant="ghost"
      tone="neutral"
      :disabled="state.loading || !state.hasNextPage"
      :aria-label="t.pagination.next"
      @click="state.setPage(state.page + 1)"
    >
      <ChevronRight class="rtl:rotate-180" />
    </Button>
  </nav>
</template>
