<script setup lang="ts">
  import { DataTable, Tag } from '@hina-ui/vue'
  import { tableDemo } from '../../data-table'
  const { rows, columns, statusLabels } = tableDemo('en')
</script>

<template>
  <DataTable :rows="rows.slice(0, 4)" :columns="columns" row-key="id" label="Entries">
    <template #cell-status="{ row }">
      <Tag :tone="row.status === 'active' ? 'success' : 'neutral'">
        {{ statusLabels[row.status] }}
      </Tag>
    </template>
  </DataTable>
</template>
