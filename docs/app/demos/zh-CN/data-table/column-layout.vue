<script setup lang="ts">
  import { ref } from 'vue'
  import { DataTable, type DataTableColumn } from '@hina-ui/vue'
  import { tableDemo, type TableDemoRow } from '../../data-table'
  const { rows, columns } = tableDemo('zh-CN')
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
    .map(row => ({ ...row, name: `${row.name} — 这是一段会随列宽变化而截断的名称` }))
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
    label="条目列表"
  />
</template>
