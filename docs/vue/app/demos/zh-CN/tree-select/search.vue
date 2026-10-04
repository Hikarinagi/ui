<script setup lang="ts">
  import { ref } from 'vue'
  import { Stack, Text, TreeSelect } from '@hina-ui/vue'
  import { regions } from './data'

  const region = ref<string | null>(null)
  const search = ref('')
</script>

<template>
  <Stack class="w-64">
    <TreeSelect
      v-model="region"
      v-model:search="search"
      :items="regions"
      searchable
      search-placeholder="搜索节点"
      aria-label="地区"
    />
    <Text tone="muted">当前值：{{ region ?? '无' }}</Text>
    <Text tone="muted">搜索：{{ search || '无' }}</Text>
  </Stack>
</template>
