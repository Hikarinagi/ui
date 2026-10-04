<script setup lang="ts">
  import { ref } from 'vue'
  import { DataTable, SearchInput, Text, Tag, Inline } from '@hina-ui/vue'
  import { useRemoteTableDemo } from '../../data-table'
  const { rows, columns, statusLabels, total, loading, lastQuery, load } = useRemoteTableDemo('en')
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
    label="Entries"
    @change="load"
  >
    <template #toolbar>
      <Inline justify="between">
        <SearchInput
          size="sm"
          v-model="filter"
          placeholder="Search names"
          aria-label="Search names"
          class="w-64 max-w-full"
        />
        <Text size="sm" tone="muted">
          Page {{ lastQuery.page }} · Returned {{ rows.length }} / {{ total }}
        </Text>
      </Inline>
    </template>
    <template #cell-status="{ row }">
      <Tag :tone="row.status === 'active' ? 'success' : 'neutral'">
        {{ statusLabels[row.status] }}
      </Tag>
    </template>
  </DataTable>
</template>
