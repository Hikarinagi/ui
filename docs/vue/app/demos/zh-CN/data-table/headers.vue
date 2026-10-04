<script setup lang="ts">
  import { DataTable, type DataTableColumn } from '@hina-ui/vue'
  import { tableDemo, type TableDemoRow } from '../../data-table'
  const { rows, columns } = tableDemo('zh-CN')
  const groupedColumns: DataTableColumn<TableDemoRow>[] = [
    { key: 'details', label: '基本信息', children: [columns[0]!, columns[1]!] },
    { ...columns[2]!, aggregate: 'sum', footer: true },
  ]
</script>

<template>
  <DataTable :rows="rows.slice(0, 5)" :columns="groupedColumns" row-key="id" label="条目列表">
    <template #footer-name>合计</template>
  </DataTable>
</template>
