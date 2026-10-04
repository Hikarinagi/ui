<script setup lang="ts">
  import { DataTable, Tag } from '@hina-ui/vue'
  import { tableDemo } from '../../data-table'
  const { rows, columns, statusLabels } = tableDemo('zh-CN')
</script>

<template>
  <DataTable :rows="rows.slice(0, 4)" :columns="columns" row-key="id" label="条目列表">
    <template #cell-status="{ row }">
      <Tag :tone="row.status === 'active' ? 'success' : 'neutral'">
        {{ statusLabels[row.status] }}
      </Tag>
    </template>
  </DataTable>
</template>
