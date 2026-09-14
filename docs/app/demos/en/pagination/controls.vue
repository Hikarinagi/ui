<script setup lang="ts">
  import { ref } from 'vue'
  import { Pagination, Stack, Text, type PaginationChange } from '@hina-ui/vue'

  const page = ref(8)
  const pageSize = ref(10)
  const lastChange = ref<PaginationChange>()
</script>

<template>
  <Stack gap="sm">
    <Pagination
      v-model="page"
      v-model:page-size="pageSize"
      :total="246"
      :page-size-options="[10, 20, 50]"
      show-info
      show-jump
      @change="lastChange = $event"
    />
    <Text size="sm" tone="muted">change: {{ lastChange ?? '—' }}</Text>
  </Stack>
</template>
