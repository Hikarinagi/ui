<script setup lang="ts">
  import { computed } from 'vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import Select from '../select/Select.vue'
  import { usePaginationContext } from './context'
  defineOptions({ name: 'HnPaginationSize' })
  const props = defineProps<{ class?: string }>()
  const { state, options, size, blocked, resize, direction } = usePaginationContext()
  const t = useUiLocale()
  const model = computed({
    get: () => state.value.pageSize,
    set: (value: string | number | null | undefined) => {
      if (value != null) resize(Number(value))
    },
  })
</script>

<template>
  <Select
    v-model="model"
    :options="options"
    :size="size"
    :disabled="blocked"
    :aria-label="t.pagination.pageSizeLabel"
    :dir="direction"
    data-hn-pagination-size
    :class="cn('w-auto shrink-0 whitespace-nowrap', props.class)"
  />
</template>
