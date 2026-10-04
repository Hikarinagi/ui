<script setup lang="ts">
  import { ref } from 'vue'
  import { Select, Stack, Text } from '@hina-ui/vue'

  const status = ref<string | null>(null)
  const statuses = [
    { value: 'wish', label: '想看' },
    { value: 'doing', label: '在看' },
    { value: 'done', label: '看过' },
    { value: 'dropped', label: '抛弃' },
  ]
</script>

<template>
  <Stack class="w-56">
    <Select v-model="status" :options="statuses" placeholder="选择收藏状态" aria-label="收藏状态" />
    <Text tone="muted">当前值：{{ status ?? '无' }}</Text>
  </Stack>
</template>
