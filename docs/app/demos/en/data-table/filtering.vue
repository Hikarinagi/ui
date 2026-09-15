<script setup lang="ts">
  import { ref } from 'vue'
  import { DataTable, SearchInput } from '@hina-ui/vue'
  import { tableDemo } from '../../data-table'
  const { rows, columns } = tableDemo('en')
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
    label="Entries"
  >
    <template #toolbar>
      <SearchInput
        v-model="filter"
        placeholder="Filter names"
        aria-label="Filter names"
        class="w-64 max-w-full"
      />
    </template>
  </DataTable>
</template>
