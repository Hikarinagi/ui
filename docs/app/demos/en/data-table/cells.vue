<script setup lang="ts">
  import { Avatar, DataTable, Inline, Progress, Stack, Tag, Text } from '@hina-ui/vue'
  import { tableDemo } from '../../data-table'
  const { rows, columns, statusLabels } = tableDemo('en')
</script>

<template>
  <DataTable :rows="rows.slice(0, 5)" :columns="columns" row-key="id" label="Entries">
    <template #cell-name="{ row }">
      <Inline gap="sm" :wrap="false" class="min-w-36 py-2">
        <Avatar :name="row.name.slice(-1)" size="sm" aria-hidden="true" />
        <Stack gap="none">
          <Text size="sm" weight="medium" class="whitespace-nowrap">{{ row.name }}</Text>
          <Text size="xs" tone="muted">ID {{ row.id }}</Text>
        </Stack>
      </Inline>
    </template>
    <template #cell-status="{ row }">
      <Tag :tone="row.status === 'active' ? 'success' : 'neutral'">
        {{ statusLabels[row.status] }}
      </Tag>
    </template>
    <template #cell="{ column, value }">
      <Inline v-if="column.key === 'count'" gap="sm" :wrap="false" class="min-w-32">
        <Progress
          :value="Number(value)"
          :max="150"
          :aria-label="column.label"
          size="sm"
          class="flex-1"
        />
        <Text size="sm" class="w-8 shrink-0 text-end tabular-nums">{{ value }}</Text>
      </Inline>
      <template v-else>{{ value }}</template>
    </template>
  </DataTable>
</template>
