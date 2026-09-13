<script setup lang="ts">
  import { ref } from 'vue'
  import { Pagination, Stack, Text } from '@hina-ui/vue'

  const page = ref(3)
</script>

<template>
  <Stack gap="lg">
    <Stack v-for="size in ['sm', 'md', 'lg'] as const" :key="size" gap="xs">
      <Text size="sm" tone="muted">{{ size }}</Text>
      <Pagination v-model="page" :total="50" :size="size" />
    </Stack>
  </Stack>
</template>
