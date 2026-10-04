<script setup lang="ts">
  import { ref } from 'vue'
  import { DataTable, Select, type DataTableFilter } from '@hina-ui/vue'
  import { tableDemo } from '../../data-table'
  const { rows, columns, statusLabels } = tableDemo('zh-CN')
  const filters = ref<DataTableFilter[]>([])
  const options = Object.entries(statusLabels).map(([value, label]) => ({ value, label }))
  const filteredColumns = columns.map(column =>
    column.key === 'status' ? { ...column, filterMode: 'equals' as const } : column,
  )
</script>

<template>
  <DataTable
    v-model:column-filters="filters"
    :rows="rows"
    :columns="filteredColumns"
    row-key="id"
    pagination
    :page-size="5"
    label="条目列表"
  >
    <template #header-status="{ column, filterValue, setFilter }">
      <Select
        :model-value="filterValue === undefined ? undefined : String(filterValue)"
        :options="options"
        :placeholder="column.label"
        :aria-label="column.label"
        clearable
        size="sm"
        class="w-36 py-1"
        @update:model-value="setFilter"
      />
    </template>
  </DataTable>
</template>
