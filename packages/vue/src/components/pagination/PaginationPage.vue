<script setup lang="ts">
  import { useTemplateRef } from 'vue'
  import { PaginationListItem } from 'reka-ui'
  import Button from '../button/Button.vue'
  import { vTooltip } from '../tooltip/directive'
  import { useUiLocale } from '../../locale'
  import { usePaginationContext } from './context'
  import { paginationItem } from './pagination.variants'
  import { usePaginationPageTooltip } from './composables/usePaginationPageTooltip'

  defineOptions({ name: 'HnPaginationPage' })
  const props = defineProps<{ page: number }>()
  const { state, size, blocked } = usePaginationContext()
  const t = useUiLocale()
  const label = useTemplateRef<HTMLElement>('label')
  const tooltip = usePaginationPageTooltip(label, blocked)
</script>

<template>
  <PaginationListItem :value="props.page" as-child>
    <Button
      v-tooltip="tooltip"
      variant="ghost"
      tone="neutral"
      :size="size"
      :aria-label="t.pagination.pageLabel(props.page)"
      :class="paginationItem({ size, selected: props.page === state.page })"
    >
      <span ref="label" class="min-w-0 truncate">
        <slot :page="props.page" :selected="props.page === state.page">{{ props.page }}</slot>
      </span>
    </Button>
  </PaginationListItem>
</template>
