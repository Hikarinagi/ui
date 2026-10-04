<script setup lang="ts">
  import { ref } from 'vue'
  import { Pagination, Stack, Text } from '@hina-ui/vue'

  const page = ref(3)
</script>

<template>
  <Stack gap="lg">
    <Stack v-for="dir in ['ltr', 'rtl'] as const" :key="dir" gap="xs">
      <Text size="sm" tone="muted">{{ dir.toUpperCase() }}</Text>
      <Pagination v-model="page" :total="50" :dir="dir" />
    </Stack>
  </Stack>
</template>
