<script setup lang="ts">
  import { ref } from 'vue'
  import { DataTable, type DataTableKey } from '@hina-ui/vue'
  import { treeTableDemo } from '../../data-table'
  const { rows, columns, getChildren } = treeTableDemo('zh-CN')
  const selected = ref<DataTableKey[]>([4])
  const expanded = ref<DataTableKey[]>([1])
</script>

<template>
  <DataTable
    v-model:selected="selected"
    v-model:expanded="expanded"
    :rows="rows"
    :columns="columns"
    :get-children="getChildren"
    row-key="id"
    row-label="name"
    selectable
    label="条目列表"
  />
</template>
