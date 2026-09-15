<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, DataTable, Inline, type DataTableKey } from '@hina-ui/vue'
  import { tableDemo } from '../../data-table'
  const { rows, columns } = tableDemo('zh-CN')
  const selected = ref<DataTableKey[]>([1, 2])
</script>

<template>
  <DataTable
    v-model:selected="selected"
    :rows="rows.slice(0, 5)"
    :columns="columns"
    row-key="id"
    row-label="name"
    selectable
    label="条目列表"
  >
    <template #toolbar="{ api }">
      <Inline wrap>
        <Button
          size="sm"
          variant="soft"
          tone="neutral"
          @click="api.exportCsv({ formatted: true, filename: 'entries.csv' })"
        >
          导出 CSV
        </Button>
        <Button
          size="sm"
          variant="ghost"
          tone="neutral"
          :disabled="!selected.length"
          @click="api.exportCsv({ scope: 'selected', formatted: true, filename: 'selected.csv' })"
        >
          导出所选
        </Button>
      </Inline>
    </template>
  </DataTable>
</template>
