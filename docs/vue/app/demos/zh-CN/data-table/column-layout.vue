<script setup lang="ts">
  import { ref } from 'vue'
  import {
    DataTable,
    Stack,
    Inline,
    Text,
    Select,
    Button,
    type DataTableColumn,
  } from '@hina-ui/vue'
  import { tableDemo, type TableDemoRow } from '../../data-table'
  const { rows, columns } = tableDemo('zh-CN')
  const mode = ref<'fit' | 'expand'>('fit')
  const modes = [
    { value: 'fit', label: '保持总宽' },
    { value: 'expand', label: '仅调整当前列' },
  ]
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
  <Stack gap="sm" class="w-full">
    <Inline justify="between">
      <Inline gap="sm">
        <Text size="sm" tone="muted">调宽模式</Text>
        <Select v-model="mode" :options="modes" size="sm" class="w-44" aria-label="调宽模式" />
      </Inline>
      <Button
        size="sm"
        variant="ghost"
        tone="neutral"
        :disabled="!order.length && !Object.keys(widths).length"
        @click="
          () => {
            order = []
            widths = {}
          }
        "
      >
        恢复列布局
      </Button>
    </Inline>
    <DataTable
      v-model:column-order="order"
      v-model:column-widths="widths"
      :rows="longRows"
      :columns="sizedColumns"
      row-key="id"
      resizable
      :resize-mode="mode"
      reorder-columns
      label="条目列表"
    />
  </Stack>
</template>
