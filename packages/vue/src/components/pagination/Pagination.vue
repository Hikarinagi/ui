<script setup lang="ts">
  import { PaginationRoot, PaginationList, PaginationListItem, PaginationEllipsis } from 'reka-ui'
  import { MoreHorizontal } from '@lucide/vue'
  import { cn } from '../../lib/cn'
  import { useDirection } from '../../lib/useDirection'
  import { useUiLocale } from '../../locale'
  import Button from '../button/Button.vue'
  import type { ButtonVariants } from '../button/button.variants'
  import PaginationControl from './PaginationControl.vue'
  import { usePagination } from './composables/usePagination'
  import { pagination, paginationList, paginationItem } from './pagination.variants'

  defineOptions({ name: 'HnPagination', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      total: number
      pageSize?: number
      siblingCount?: number
      showEdges?: boolean
      showFirstLast?: boolean
      size?: ButtonVariants['size']
      disabled?: boolean
      dir?: 'ltr' | 'rtl'
      label?: string
      class?: string
    }>(),
    { pageSize: 10, siblingCount: 1, showEdges: true },
  )

  const model = defineModel<number>({ default: 1 })
  defineSlots<{
    page?(props: { page: number; selected: boolean }): unknown
    ellipsis?(): unknown
  }>()

  const t = useUiLocale()
  const { root, direction, rootDirection } = useDirection(() => props.dir)
  const { total, pageSize, siblingCount, page, update } = usePagination(props, model)
</script>

<template>
  <PaginationRoot
    :page="page"
    :total="total"
    :items-per-page="pageSize"
    :sibling-count="siblingCount"
    :show-edges="props.showEdges"
    :disabled="props.disabled"
    as-child
    @update:page="update"
  >
    <nav
      ref="root"
      :aria-label="props.label ?? t.pagination.navLabel"
      v-bind="$attrs"
      data-hn-pagination
      :dir="rootDirection"
      :data-disabled="props.disabled ? '' : undefined"
      :class="cn(pagination(), props.class)"
    >
      <PaginationList v-slot="{ items }" as="ul" :class="paginationList()">
        <li v-if="props.showFirstLast">
          <PaginationControl action="first" :size="props.size" :dir="direction" />
        </li>
        <li>
          <PaginationControl action="prev" :size="props.size" :dir="direction" />
        </li>
        <li
          v-for="(item, index) in items"
          :key="item.type === 'page' ? item.value : 'ellipsis-' + index"
        >
          <PaginationListItem v-if="item.type === 'page'" :value="item.value" as-child>
            <Button
              :variant="item.value === page ? 'solid' : 'ghost'"
              :tone="item.value === page ? 'accent' : 'neutral'"
              :size="props.size"
              :aria-label="t.pagination.pageLabel(item.value)"
              :class="paginationItem({ size: props.size })"
            >
              <slot name="page" :page="item.value" :selected="item.value === page">
                {{ item.value }}
              </slot>
            </Button>
          </PaginationListItem>
          <PaginationEllipsis
            v-else
            as="span"
            aria-hidden="true"
            class="text-muted flex items-center justify-center px-1"
          >
            <slot name="ellipsis"><MoreHorizontal class="size-4" /></slot>
          </PaginationEllipsis>
        </li>
        <li>
          <PaginationControl action="next" :size="props.size" :dir="direction" />
        </li>
        <li v-if="props.showFirstLast">
          <PaginationControl action="last" :size="props.size" :dir="direction" />
        </li>
      </PaginationList>
    </nav>
  </PaginationRoot>
</template>
