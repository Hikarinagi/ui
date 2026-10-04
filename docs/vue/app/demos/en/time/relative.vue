<script setup lang="ts">
  import { Stack, Text, Time } from '@hina-ui/vue'

  const now = Date.now()
  const items = [
    { label: '10 seconds ago', value: now - 10 * 1000 },
    { label: '3 minutes ago', value: now - 3 * 60 * 1000 },
    { label: '5 hours ago', value: now - 5 * 60 * 60 * 1000 },
    { label: 'in 2 days', value: now + 2 * 24 * 60 * 60 * 1000 },
  ]
</script>

<template>
  <Stack class="max-w-sm" gap="xs">
    <Text v-for="item in items" :key="item.label" size="sm">
      {{ item.label }}:
      <Time :value="item.value" format="relative" />
    </Text>
  </Stack>
</template>
