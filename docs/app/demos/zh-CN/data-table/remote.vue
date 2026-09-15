<script setup lang="ts">
  import { ref } from 'vue'
  import { DataTable, SearchInput, Text, Tag } from '@hina-ui/vue'
  import { useRemoteTableDemo } from '../../data-table'
  const { rows, columns, statusLabels, total, loading, lastQuery, load } =
    useRemoteTableDemo('zh-CN')
  const filter = ref('')
</script>

<template>
  <DataTable
    v-model:filter="filter"
    :rows="rows"
    :columns="columns"
    :total="total"
    :loading="loading"
    row-key="id"
    manual
    pagination
    :page-size="5"
    label="条目列表"
    @change="load"
  >
    <template #toolbar>
      <SearchInput
        v-model="filter"
        placeholder="搜索名称"
        aria-label="搜索名称"
        class="w-64 max-w-full"
      />
      <Text size="sm" tone="muted">
        请求页 {{ lastQuery.page }} · 返回 {{ rows.length }} / {{ total }}
      </Text>
    </template>
    <template #cell-status="{ row }">
      <Tag :tone="row.status === 'active' ? 'success' : 'neutral'">
        {{ statusLabels[row.status] }}
      </Tag>
    </template>
  </DataTable>
</template>
