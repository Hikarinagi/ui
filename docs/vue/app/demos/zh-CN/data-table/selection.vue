<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, DataTable, Inline, Text, type DataTableKey } from '@hina-ui/vue'
  import { tableDemo } from '../../data-table'
  const { rows, columns } = tableDemo('zh-CN')
  const selected = ref<DataTableKey[]>([1])
</script>

<template>
  <DataTable
    v-model:selected="selected"
    :rows="rows"
    :columns="columns"
    row-key="id"
    row-label="name"
    :selectable="row => row.status !== 'archived'"
    pagination
    :page-size="5"
    label="条目列表"
  >
    <template #toolbar>
      <Inline align="center" justify="between">
        <Text size="sm" tone="muted">已选：{{ selected.length }}</Text>
        <Button
          variant="ghost"
          tone="neutral"
          size="sm"
          :disabled="!selected.length"
          @click="selected = []"
        >
          清空选择
        </Button>
      </Inline>
    </template>
  </DataTable>
</template>
