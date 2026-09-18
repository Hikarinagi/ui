<script setup lang="ts">
  import { ref } from 'vue'
  import { DataList, Select, Text } from '@hina-ui/vue'
  import { dataListDemo } from '../../data-list'
  const items = dataListDemo('zh-CN')
  const page = ref(1)
  const pageSize = ref(10)
  const sizes = [10, 20, 50].map(value => ({ value, label: `${value} 条 / 页` }))
</script>
<template>
  <DataList
    v-model:page="page"
    v-model:page-size="pageSize"
    :items="items"
    item-key="id"
    item-title="title"
    item-description="subtitle"
    pagination
    class="max-w-2xl"
  >
    <template #header="{ pageSize: size, setPageSize }">
      <Text size="sm" tone="muted">共 {{ items.length }} 条</Text>
      <Select
        :model-value="size"
        :options="sizes"
        size="sm"
        class="w-36 max-w-full"
        aria-label="每页条数"
        @update:model-value="value => setPageSize(Number(value))"
      />
    </template>
    <template #meta="{ item }">
      <Text size="xs" tone="muted">{{ item.released }}</Text>
    </template>
  </DataList>
</template>
