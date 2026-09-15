<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, DataTable, Empty, Stack } from '@hina-ui/vue'
  import { tableDemo } from '../../data-table'
  const { rows, columns } = tableDemo('zh-CN')
  const loading = ref(false)
</script>

<template>
  <Stack>
    <Button variant="soft" tone="neutral" class="self-start" @click="loading = !loading">
      切换加载状态
    </Button>
    <DataTable
      :rows="rows.slice(0, 3)"
      :columns="columns"
      row-key="id"
      :loading="loading"
      label="条目列表"
    />
    <DataTable :rows="[]" :columns="columns" row-key="id" label="条目列表">
      <template #empty><Empty size="sm" title="暂无条目" :icon="false" /></template>
    </DataTable>
  </Stack>
</template>
