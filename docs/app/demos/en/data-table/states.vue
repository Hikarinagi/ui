<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, DataTable, Empty, Stack } from '@hina-ui/vue'
  import { tableDemo } from '../../data-table'
  const { rows, columns } = tableDemo('en')
  const loading = ref(false)
</script>

<template>
  <Stack class="w-full">
    <Button size="sm" variant="soft" tone="neutral" class="self-start" @click="loading = !loading">
      Toggle loading
    </Button>
    <DataTable
      :rows="rows.slice(0, 3)"
      :columns="columns"
      row-key="id"
      :loading="loading"
      label="Entries"
    />
    <DataTable :rows="[]" :columns="columns" row-key="id" label="Entries">
      <template #empty><Empty size="sm" title="No entries" :icon="false" /></template>
    </DataTable>
  </Stack>
</template>
