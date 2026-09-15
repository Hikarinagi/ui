<script setup lang="ts">
  import { ref } from 'vue'
  import { Text, Button, DataTable } from '@hina-ui/vue'
  import { tableDemo } from '../../data-table'
  const { rows, columns, statusLabels } = tableDemo('en')
  const grouping = ref(['status'])
  const expandedGroups = ref(['status:active'])
  const groupedColumns = columns.map(column =>
    column.key === 'count' ? { ...column, aggregate: 'sum' as const } : column,
  )
</script>

<template>
  <DataTable
    v-model:grouping="grouping"
    v-model:expanded-groups="expandedGroups"
    :rows="rows.slice(0, 8)"
    :columns="groupedColumns"
    row-key="id"
    label="Entries"
  >
    <template #group="{ value, rows: members, expanded, toggleExpanded, aggregate }">
      <Button
        variant="ghost"
        tone="neutral"
        type="button"
        class="h-auto w-full justify-between gap-3 px-2 py-2 text-start"
        :aria-expanded="expanded"
        @click="toggleExpanded()"
      >
        <Text as="span" size="sm">
          {{ expanded ? '−' : '+' }} {{ statusLabels[value as keyof typeof statusLabels] }} ({{
            members.length
          }})
        </Text>
        <Text as="span" size="sm" tone="muted">Total {{ aggregate('count') }}</Text>
      </Button>
    </template>
  </DataTable>
</template>
