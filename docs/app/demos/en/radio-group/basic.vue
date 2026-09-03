<script setup lang="ts">
  import { ref } from 'vue'
  import { RadioGroup, Stack, Text } from '@hina-ui/vue'

  const theme = ref('system')
  const options = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'Follow system' },
  ]
</script>

<template>
  <Stack gap="sm">
    <RadioGroup v-model="theme" :options="options" aria-label="Theme" />
    <Text size="sm" tone="muted">Value: {{ theme }}</Text>
  </Stack>
</template>
