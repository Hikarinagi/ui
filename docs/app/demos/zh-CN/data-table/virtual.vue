<script setup lang="ts">
  import { ref } from 'vue'
  import { Stack, Button, DataTable, type DataTableApi } from '@hina-ui/vue'
  import { tableDemo, type TableDemoRow } from '../../data-table'
  const { columns } = tableDemo('zh-CN')
  const table = ref<{ api: DataTableApi<TableDemoRow> }>()
  const rows: TableDemoRow[] = Array.from({ length: 10000 }, (_, index) => ({
    id: index + 1,
    name: '条目 ' + (index + 1),
    status: 'active',
    count: index,
  }))
</script>

<template>
  <DataTable
    ref="table"
    :rows="rows"
    :columns="columns"
    row-key="id"
    row-label="name"
    :virtualize="{ estimateSize: 44, overscan: 6 }"
    :height="320"
    sticky-header
    expandable
    label="条目列表"
  >
    <template #toolbar>
      <Button
        size="sm"
        variant="soft"
        tone="neutral"
        class="self-start"
        @click="table?.api.scrollToRow(5000)"
      >
        跳到第 5,000 行
      </Button>
    </template>
    <template #expansion="{ row }">
      <Stack class="flex h-32 items-center text-muted">{{ row.name }} · 展开内容</Stack>
    </template>
  </DataTable>
</template>
