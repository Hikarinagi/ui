<script setup lang="ts">
  import { ref } from 'vue'
  import { LayoutGrid, List, Rows3 } from '@lucide/vue'
  import { SegmentedControl } from '@hina-ui/vue'

  const icons = { grid: LayoutGrid, list: List, rows: Rows3 }
  const view = ref('grid')
  const options = [
    { value: 'grid', label: '网格' },
    { value: 'list', label: '列表' },
    { value: 'rows', label: '详情' },
  ]
</script>

<template>
  <SegmentedControl v-model="view" :options="options" aria-label="视图">
    <template #option="{ option }">
      <component :is="icons[option.value as keyof typeof icons]" />
    </template>
  </SegmentedControl>
</template>
