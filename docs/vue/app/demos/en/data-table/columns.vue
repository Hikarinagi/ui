<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { Checkbox, DataTable } from '@hina-ui/vue'
  import { tableDemo } from '../../data-table'
  const { rows, columns } = tableDemo('en')
  const showCount = ref(true)
  const hiddenColumns = computed(() => (showCount.value ? [] : ['count']))
</script>

<template>
  <DataTable
    :rows="rows.slice(0, 4)"
    :columns="columns"
    :hidden-columns="hiddenColumns"
    row-key="id"
    label="Entries"
  >
    <template #toolbar><Checkbox v-model="showCount">Show count column</Checkbox></template>
  </DataTable>
</template>
