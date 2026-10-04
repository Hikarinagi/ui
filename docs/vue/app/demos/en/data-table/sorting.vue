<script setup lang="ts">
  import { ref } from 'vue'
  import { DataTable, Text, Stack, type DataTableSort } from '@hina-ui/vue'
  import { tableDemo } from '../../data-table'
  const { rows, columns } = tableDemo('en')
  const sorting = ref<DataTableSort[]>([])
</script>

<template>
  <Stack class="w-full">
    <DataTable
      v-model:sorting="sorting"
      :rows="rows.slice(0, 6)"
      :columns="columns"
      row-key="id"
      multi-sort
      label="Entries"
    />
    <Text size="sm" tone="muted">
      {{
        sorting.length
          ? sorting
              .map(
                sort =>
                  `${columns.find(column => column.key === sort.key)?.label ?? sort.key}: ${sort.desc ? 'descending' : 'ascending'}`,
              )
              .join(' · ')
          : 'Unsorted'
      }}
    </Text>
  </Stack>
</template>
