<script setup lang="ts">
  import { computed } from 'vue'
  import { LayoutGrid, List } from '@lucide/vue'
  import SegmentedControl from '../segmented-control/SegmentedControl.vue'
  import { useUiLocale } from '../../locale'
  import type { DataListLayout } from './types'
  defineProps<{ modelValue: DataListLayout }>()
  const emit = defineEmits<{ 'update:modelValue': [value: DataListLayout] }>()
  const t = useUiLocale()
  const options = computed(() => [
    { value: 'list', label: t.value.dataList.list },
    { value: 'grid', label: t.value.dataList.grid },
  ])
</script>
<template>
  <SegmentedControl
    :model-value="modelValue"
    :options="options"
    :aria-label="t.dataList.layout"
    @update:model-value="emit('update:modelValue', $event === 'grid' ? 'grid' : 'list')"
  >
    <template #option="{ option }">
      <List v-if="option.value === 'list'" class="size-4" />
      <LayoutGrid v-else class="size-4" />
    </template>
  </SegmentedControl>
</template>
