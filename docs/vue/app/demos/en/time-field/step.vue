<script setup lang="ts">
  import { ref } from 'vue'
  import { Stack, Text, TimeField } from '@hina-ui/vue'

  const time = ref<string | null>('09:00')
</script>

<template>
  <Stack gap="sm" align="start">
    <TimeField v-model="time" :minute-step="15" aria-label="Booking slot" class="w-40" />
    <Text tone="muted" size="sm">Value: {{ time ?? 'empty' }}</Text>
  </Stack>
</template>
