<script setup lang="ts">
  import { ref } from 'vue'
  import { DateField, Stack, Text } from '@hina-ui/vue'

  const date = ref<string | null>(null)
</script>

<template>
  <Stack gap="sm" align="start">
    <DateField v-model="date" aria-label="Release date" class="w-72" />
    <Text tone="muted" size="sm">Value: {{ date ?? 'empty' }}</Text>
  </Stack>
</template>
