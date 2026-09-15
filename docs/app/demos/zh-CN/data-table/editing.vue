<script setup lang="ts">
  import { Checkbox, DataTable, Select, Inline } from '@hina-ui/vue'
  import { useEditableTableDemo } from '../../data-table'
  const { rows, columns, statusLabels, mode, fail, save } = useEditableTableDemo('zh-CN')
  const modes = [
    { value: 'cell', label: '单元格' },
    { value: 'row', label: '整行' },
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
    label="条目列表"
  >
    <template #toolbar>
      <Inline align="center" wrap>
        <Select v-model="mode" :options="modes" aria-label="编辑模式" class="w-32" />
        <Checkbox v-model="fail">模拟保存失败</Checkbox>
      </Inline>
    </template>
    <template #editor-status="{ value, updateValue, pending }">
      <Select
        :model-value="value as string"
        :options="options"
        :disabled="pending"
        aria-label="状态"
        size="sm"
        @update:model-value="updateValue"
      />
    </template>
  </DataTable>
</template>
