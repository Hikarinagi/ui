<script setup lang="ts">
  import { ref } from 'vue'
  import { Select, Stack, Text } from '@hina-ui/vue'

  const status = ref<string | null>(null)
  const statuses = [
    { value: 'wish', label: 'Want to read' },
    { value: 'doing', label: 'Reading' },
    { value: 'done', label: 'Finished' },
    { value: 'dropped', label: 'Dropped' },
  ]
</script>

<template>
  <Stack class="w-56">
    <Select
      v-model="status"
      :options="statuses"
      placeholder="Choose a status"
      aria-label="Collection status"
    />
    <Text tone="muted">Current value: {{ status ?? 'none' }}</Text>
  </Stack>
</template>
