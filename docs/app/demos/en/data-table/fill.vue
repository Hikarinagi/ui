<script setup lang="ts">
  import { Stack, DataTable } from '@hina-ui/vue'
  import { tableDemo } from '../../data-table'
  const { rows, columns } = tableDemo('en')
  const summaryColumns = columns.map(column =>
    column.key === 'count' ? { ...column, aggregate: 'sum' as const, footer: true } : column,
  )
</script>

<template>
  <Stack class="h-80">
    <DataTable
      :rows="rows"
      :columns="summaryColumns"
      row-key="id"
      fill
      sticky-header
      sticky-footer
      pagination
      :page-size="15"
      label="Entries"
    >
      <template #footer-name>Total</template>
    </DataTable>
  </Stack>
</template>
