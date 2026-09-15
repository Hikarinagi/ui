<script setup lang="ts">
  import { ref } from 'vue'
  import { DataTable, type DataTableKey } from '@hina-ui/vue'
  import { tableDemo } from '../../data-table'
  const { rows, columns } = tableDemo('zh-CN')
  const selected = ref<DataTableKey[]>([2])
</script>

<template>
  <DataTable
    v-model:selected="selected"
    :rows="rows.slice(0, 4)"
    :columns="columns"
    row-key="id"
    row-label="name"
    selectable
    selection-mode="single"
    label="条目列表"
  />
</template>
