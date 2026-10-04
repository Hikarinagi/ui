<script setup lang="ts">
  import { ref } from 'vue'
  import { LayoutGrid, List, Rows3 } from '@lucide/vue'
  import { SegmentedControl } from '@hina-ui/vue'

  const icons = { grid: LayoutGrid, list: List, rows: Rows3 }
  const view = ref('grid')
  const options = [
    { value: 'grid', label: 'Grid' },
    { value: 'list', label: 'List' },
    { value: 'rows', label: 'Details' },
  ]
</script>

<template>
  <SegmentedControl v-model="view" :options="options" aria-label="View">
    <template #option="{ option }">
      <component :is="icons[option.value as keyof typeof icons]" />
    </template>
  </SegmentedControl>
</template>
