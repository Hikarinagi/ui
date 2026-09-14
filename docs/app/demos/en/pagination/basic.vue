<script setup lang="ts">
  import { ref } from 'vue'
  import { Pagination, Stack, Text } from '@hina-ui/vue'

  const page = ref(1)
</script>

<template>
  <Stack gap="sm">
    <Pagination v-model="page" :total="95" :page-size="10" />
    <Text size="sm" tone="muted">Page: {{ page }} / 10</Text>
  </Stack>
</template>
