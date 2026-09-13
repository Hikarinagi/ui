<script setup lang="ts">
  import { ref } from 'vue'
  import { Pagination, Stack, Text } from '@hina-ui/vue'

  const page = ref(10)
</script>

<template>
  <Stack gap="lg">
    <Stack gap="xs">
      <Text size="sm" tone="muted">sibling-count="1"</Text>
      <Pagination v-model="page" :total="200" />
    </Stack>
    <Stack gap="xs">
      <Text size="sm" tone="muted">sibling-count="0" + show-first-last</Text>
      <Pagination v-model="page" :total="200" :sibling-count="0" show-first-last />
    </Stack>
    <Stack gap="xs">
      <Text size="sm" tone="muted">show-edges="false"</Text>
      <Pagination v-model="page" :total="200" :show-edges="false" />
    </Stack>
  </Stack>
</template>
