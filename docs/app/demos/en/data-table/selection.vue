<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, DataTable, Inline, Text, type DataTableKey } from '@hina-ui/vue'
  import { tableDemo } from '../../data-table'
  const { rows, columns } = tableDemo('en')
  const selected = ref<DataTableKey[]>([1])
</script>

<template>
  <DataTable
    v-model:selected="selected"
    :rows="rows"
    :columns="columns"
    row-key="id"
    row-label="name"
    :selectable="row => row.status !== 'archived'"
    pagination
    :page-size="5"
    label="Entries"
  >
    <template #toolbar>
      <Inline align="center" justify="between">
        <Text size="sm" tone="muted">Selected：{{ selected.length }}</Text>
        <Button
          variant="ghost"
          tone="neutral"
          size="sm"
          :disabled="!selected.length"
          @click="selected = []"
        >
          Clear selection
        </Button>
      </Inline>
    </template>
  </DataTable>
</template>
