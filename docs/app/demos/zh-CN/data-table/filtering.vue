<script setup lang="ts">
  import { ref } from 'vue'
  import { DataTable, SearchInput } from '@hina-ui/vue'
  import { tableDemo } from '../../data-table'
  const { rows, columns } = tableDemo('zh-CN')
  const filter = ref('')
</script>

<template>
  <DataTable
    v-model:filter="filter"
    :rows="rows"
    :columns="columns"
    row-key="id"
    pagination
    :page-size="5"
    label="条目列表"
  >
    <template #toolbar>
      <SearchInput
        size="sm"
        v-model="filter"
        placeholder="筛选名称"
        aria-label="筛选名称"
        class="w-64 max-w-full"
      />
    </template>
  </DataTable>
</template>
