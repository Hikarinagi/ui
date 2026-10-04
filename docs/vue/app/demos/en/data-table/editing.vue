<script setup lang="ts">
  import { Checkbox, DataTable, Select, Inline } from '@hina-ui/vue'
  import { useEditableTableDemo } from '../../data-table'
  const { rows, columns, statusLabels, mode, fail, save } = useEditableTableDemo('en')
  const modes = [
    { value: 'cell', label: 'Cell' },
    { value: 'row', label: 'Row' },
  ]
  const options = Object.entries(statusLabels).map(([value, label]) => ({ value, label }))
</script>

<template>
  <DataTable
    :rows="rows"
    :columns="columns"
    row-key="id"
    row-label="name"
    :edit-mode="mode"
    :on-save="save"
    layout="fixed"
    label="Entries"
  >
    <template #toolbar>
      <Inline align="center" wrap>
        <Select size="sm" v-model="mode" :options="modes" aria-label="Edit mode" class="w-32" />
        <Checkbox v-model="fail">Simulate save failure</Checkbox>
      </Inline>
    </template>
    <template #editor-status="{ value, updateValue, pending }">
      <Select
        :model-value="value as string"
        :options="options"
        :disabled="pending"
        aria-label="Status"
        size="sm"
        @update:model-value="updateValue"
      />
    </template>
  </DataTable>
</template>
