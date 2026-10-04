<script setup lang="ts">
  import { Stepper, Stack, Text, type StepperSize } from '@hina-ui/vue'

  const sizes: StepperSize[] = ['sm', 'md', 'lg']
  const items = [
    { title: 'Step A', description: 'The first description' },
    { title: 'Step B', description: 'A longer description that wraps naturally across lines' },
    { title: 'Step C', description: 'The final description' },
  ]
</script>

<template>
  <Stack class="w-full" gap="lg">
    <Stack v-for="size in sizes" :key="size">
      <Text size="sm" tone="muted">{{ size }}</Text>
      <Stepper :items="items" :size="size" :default-value="2" />
    </Stack>
  </Stack>
</template>
