<script setup lang="ts">
  import { ref } from 'vue'
  import {
    DescriptionList,
    DescriptionTerm,
    DescriptionDetails,
    DataTable,
    type DataTableKey,
  } from '@hina-ui/vue'
  import { tableDemo } from '../../data-table'
  const { rows, columns, statusLabels } = tableDemo('en')
  const expanded = ref<DataTableKey[]>([1])
</script>

<template>
  <DataTable
    v-model:expanded="expanded"
    :rows="rows.slice(0, 4)"
    :columns="columns"
    row-key="id"
    row-label="name"
    expandable
    label="Entries"
  >
    <template #expansion="{ row }">
      <DescriptionList class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        <DescriptionTerm class="text-muted">ID</DescriptionTerm>
        <DescriptionDetails>{{ row.id }}</DescriptionDetails>
        <DescriptionTerm class="text-muted">Status</DescriptionTerm>
        <DescriptionDetails>{{ statusLabels[row.status] }}</DescriptionDetails>
        <DescriptionTerm class="text-muted">Count</DescriptionTerm>
        <DescriptionDetails>{{ row.count }}</DescriptionDetails>
      </DescriptionList>
    </template>
  </DataTable>
</template>
