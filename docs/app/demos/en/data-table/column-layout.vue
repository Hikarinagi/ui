<script setup lang="ts">
  import { ref } from 'vue'
  import { DataTable, type DataTableColumn } from '@hina-ui/vue'
  import { tableDemo, type TableDemoRow } from '../../data-table'
  const { rows, columns } = tableDemo('en')
  const order = ref<string[]>([])
  const widths = ref<Record<string, number>>({})
  const sizedColumns: DataTableColumn<TableDemoRow>[] = [
    { key: 'id', label: 'ID', width: 72, pin: 'start', reorderable: false },
    { ...columns[0]!, width: 220, minWidth: 120, maxWidth: 360, truncate: true },
    { ...columns[1]!, width: 180 },
    { ...columns[2]!, width: 140, pin: 'end', reorderable: false },
  ]
  const longRows = rows
    .slice(0, 4)
    .map(row => ({ ...row, name: `${row.name} — A longer label that can be truncated` }))
</script>

<template>
  <DataTable
    v-model:column-order="order"
    v-model:column-widths="widths"
    :rows="longRows"
    :columns="sizedColumns"
    row-key="id"
    resizable
    reorder-columns
    label="Entries"
  />
</template>
