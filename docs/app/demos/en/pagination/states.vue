<script setup lang="ts">
  import { Pagination, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="lg">
    <Stack gap="xs">
      <Text size="sm" tone="muted">Disabled</Text>
      <Pagination :model-value="3" :total="50" disabled />
    </Stack>
    <Stack gap="xs">
      <Text size="sm" tone="muted">total="0"</Text>
      <Pagination :total="0" show-first-last />
    </Stack>
  </Stack>
</template>
