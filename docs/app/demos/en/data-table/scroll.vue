<script setup lang="ts">
  import { DataTable } from '@hina-ui/vue'
  import { tableDemo } from '../../data-table'
  const { rows, columns } = tableDemo('en')
  const wideColumns = columns.map(column => ({
    ...column,
    width: column.key === 'name' ? 320 : 200,
  }))
</script>

<template>
  <DataTable
    :rows="rows"
    :columns="wideColumns"
    row-key="id"
    sticky-header
    :max-height="240"
    label="Entries"
  />
</template>
