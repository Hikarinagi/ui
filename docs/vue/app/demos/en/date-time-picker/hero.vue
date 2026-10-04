<script setup lang="ts">
  import { ref } from 'vue'
  import { DateTimePicker, Stack, Text } from '@hina-ui/vue'

  const at = ref<string | null>('2026-09-04T20:00')
</script>

<template>
  <Stack gap="sm" align="start">
    <DateTimePicker v-model="at" clearable aria-label="Publish time" class="w-80" />
    <Text tone="muted" size="sm">Value: {{ at ?? 'empty' }}</Text>
  </Stack>
</template>
