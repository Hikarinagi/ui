<script setup lang="ts">
  import { ref } from 'vue'
  import { DataTable } from '@hina-ui/vue'
  import { tableDemo } from '../../data-table'
  const { rows, columns } = tableDemo('zh-CN')
  const grouping = ref(['status'])
  const expandedGroups = ref(['status:active'])
  const groupedColumns = columns.map(column =>
    column.key === 'count' ? { ...column, aggregate: 'sum' as const } : column,
  )
</script>

<template>
  <DataTable
    v-model:grouping="grouping"
    v-model:expanded-groups="expandedGroups"
    :rows="rows.slice(0, 8)"
    :columns="groupedColumns"
    row-key="id"
    label="条目列表"
  ></DataTable>
</template>
