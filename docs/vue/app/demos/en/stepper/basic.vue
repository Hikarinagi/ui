<script setup lang="ts">
  import { ref } from 'vue'
  import { Stepper, Text, Stack } from '@hina-ui/vue'

  const step = ref(1)
  const items = [
    { title: 'Step A', description: 'The first description' },
    { title: 'Step B', description: 'A longer description that wraps naturally across lines' },
    { title: 'Step C', description: 'The final description' },
  ]
</script>

<template>
  <Stack class="w-full" gap="lg">
    <Stepper v-model="step" :items="items" />
    <Text size="sm" tone="muted">Current step：{{ step }}</Text>
  </Stack>
</template>
