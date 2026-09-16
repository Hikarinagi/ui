<script setup lang="ts">
  import { ref } from 'vue'
  import { DataTable, Pagination } from '@hina-ui/vue'
  import { tableDemo } from '../../data-table'
  const { rows, columns } = tableDemo('zh-CN')
  const page = ref(1)
  const pageSize = ref(5)
</script>

<template>
  <DataTable
    v-model:page="page"
    v-model:page-size="pageSize"
    :rows="rows"
    :columns="columns"
    row-key="id"
    pagination
    label="条目列表"
  >
    <template #footer="{ total, rows: visible }">
      <Pagination
        v-model="page"
        v-model:page-size="pageSize"
        :total="total"
        :item-count="visible.length"
        :page-size-options="[5, 10, 20]"
        show-info
        show-jump
        align="between"
      />
    </template>
  </DataTable>
</template>
