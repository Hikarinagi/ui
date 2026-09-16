<script setup lang="ts">
  import { Stack, DataTable } from '@hina-ui/vue'
  import { tableDemo } from '../../data-table'
  const { rows, columns } = tableDemo('zh-CN')
  const summaryColumns = columns.map(column =>
    column.key === 'count' ? { ...column, aggregate: 'sum' as const, footer: true } : column,
  )
</script>

<template>
  <Stack class="h-80 w-full">
    <DataTable
      :rows="rows"
      :columns="summaryColumns"
      row-key="id"
      fill
      sticky-header
      sticky-footer
      pagination
      :page-size="15"
      label="条目列表"
    >
      <template #footer-name>合计</template>
    </DataTable>
  </Stack>
</template>
