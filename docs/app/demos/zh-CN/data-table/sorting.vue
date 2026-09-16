<script setup lang="ts">
  import { ref } from 'vue'
  import { DataTable, Text, Stack, type DataTableSort } from '@hina-ui/vue'
  import { tableDemo } from '../../data-table'
  const { rows, columns } = tableDemo('zh-CN')
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
      label="条目列表"
    />
    <Text size="sm" tone="muted">
      {{
        sorting.length
          ? sorting
              .map(
                sort =>
                  `${columns.find(column => column.key === sort.key)?.label ?? sort.key} ${sort.desc ? '降序' : '升序'}`,
              )
              .join(' · ')
          : '未排序'
      }}
    </Text>
  </Stack>
</template>
