<script setup lang="ts">
  import { ref } from 'vue'
  import { DataTable, Stack, Inline, Text, Select, type DataTableColumn } from '@hina-ui/vue'
  import { tableDemo, type TableDemoRow } from '../../data-table'
  const { rows, columns } = tableDemo('en')
  const mode = ref<'fit' | 'expand'>('fit')
  const modes = [
    { value: 'fit', label: 'Keep table width' },
    { value: 'expand', label: 'Resize current column' },
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
    .map(row => ({ ...row, name: `${row.name} — A longer label that can be truncated` }))
</script>

<template>
  <Stack gap="sm">
    <Inline gap="xs">
      <Text size="sm" tone="muted">Resize mode</Text>
      <Select v-model="mode" :options="modes" size="sm" class="w-44" aria-label="Resize mode" />
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
      label="Entries"
    />
  </Stack>
</template>
