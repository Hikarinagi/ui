<script setup lang="ts">
  import { computed } from 'vue'
  import { PaginationRoot } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { useDirection } from '../../lib/useDirection'
  import { useUiLocale } from '../../locale'
  import LoadingOverlay from '../loading-overlay/LoadingOverlay.vue'
  import PaginationContent from './PaginationContent.vue'
  import PaginationInfo from './PaginationInfo.vue'
  import PaginationSize from './PaginationSize.vue'
  import PaginationJump from './PaginationJump.vue'
  import { providePagination } from './context'
  import { usePagination } from './composables/usePagination'
  import { pagination } from './pagination.variants'
  import type { PaginationChange, PaginationState } from './types'

  defineOptions({ name: 'HnPagination', inheritAttrs: false })
  const props = withDefaults(
    defineProps<{
      total: number
      itemCount?: number
      siblingCount?: number
      showEdges?: boolean
      showFirstLast?: boolean
      showInfo?: boolean
      showJump?: boolean
      hideSinglePage?: boolean
      pageSizeOptions?: number[]
      pending?: boolean
      align?: 'start' | 'center' | 'end' | 'between'
      size?: 'sm' | 'md' | 'lg'
      disabled?: boolean
      dir?: 'ltr' | 'rtl'
      label?: string
      class?: string
    }>(),
    { siblingCount: 1, showEdges: true, size: 'md', align: 'start' },
  )
  const model = defineModel<number>({ default: 1 })
  const sizeModel = defineModel<number>('pageSize', { default: 10 })
  const emit = defineEmits<{ change: [value: PaginationChange] }>()
  defineSlots<{
    default?(state: PaginationState): unknown
    list?(state: PaginationState): unknown
    page?(props: { page: number; selected: boolean }): unknown
    ellipsis?(props: { side: 'prev' | 'next'; expanded: boolean }): unknown
  }>()
  const t = useUiLocale()
  const { root, direction, rootDirection } = useDirection(() => props.dir)
  const { total, pageSize, siblingCount, page, state, blocked, sizes, update, resize } =
    usePagination(props, model, sizeModel, value => emit('change', value))
  providePagination({
    state,
    blocked,
    siblingCount,
    update,
    resize,
    direction,
    size: computed(() => props.size),
    showFirstLast: computed(() => props.showFirstLast),
    options: computed(() =>
      sizes.value.map(value => ({ value, label: t.value.pagination.pageSizeOption(value) })),
    ),
  })
</script>

<template>
  <div
    ref="root"
    v-bind="$attrs"
    data-hn-pagination
    :dir="rootDirection"
    :aria-busy="props.pending || undefined"
    :class="cn('max-w-full', $slots.list && 'flex min-h-0 flex-col gap-3', props.class)"
  >
    <div v-if="$slots.list" class="relative min-h-0 flex-auto">
      <div :inert="props.pending || undefined"><slot name="list" v-bind="state" /></div>
      <LoadingOverlay :visible="props.pending" />
    </div>
    <PaginationRoot
      v-if="!props.hideSinglePage || state.pageCount > 1"
      :page="page"
      :total="total"
      :items-per-page="pageSize"
      :sibling-count="siblingCount"
      :show-edges="props.showEdges"
      :disabled="blocked"
      as-child
      @update:page="update"
    >
      <nav
        :aria-label="props.label ?? t.pagination.navLabel"
        :inert="props.pending || undefined"
        :data-disabled="blocked ? '' : undefined"
        :class="pagination({ align: props.align })"
      >
        <slot v-bind="state">
          <PaginationInfo v-if="props.showInfo" />
          <PaginationContent>
            <template v-if="$slots.page" #page="slotProps">
              <slot name="page" v-bind="slotProps" />
            </template>
            <template v-if="$slots.ellipsis" #ellipsis="slotProps">
              <slot name="ellipsis" v-bind="slotProps" />
            </template>
          </PaginationContent>
          <div
            v-if="props.pageSizeOptions?.length || props.showJump"
            class="flex max-w-full flex-wrap items-center gap-3"
          >
            <PaginationSize v-if="props.pageSizeOptions?.length" />
            <PaginationJump v-if="props.showJump" />
          </div>
        </slot>
      </nav>
    </PaginationRoot>
  </div>
</template>
