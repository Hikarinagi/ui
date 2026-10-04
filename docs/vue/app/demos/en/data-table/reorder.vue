<script setup lang="ts">
  import { ref } from 'vue'
  import { DataTable } from '@hina-ui/vue'
  import { tableDemo } from '../../data-table'
  const source = tableDemo('en')
  const rows = ref(source.rows.slice(0, 5))
  const columns = source.columns.map(column => ({ ...column, sortable: false }))
</script>

<template>
  <DataTable
    v-model:rows="rows"
    :columns="columns"
    row-key="id"
    row-label="name"
    reorderable
    label="Entries"
  />
</template>
