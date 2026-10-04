<script setup lang="ts">
  import { ref } from 'vue'
  import { Slider, Stack, Text } from '@hina-ui/vue'

  const value = ref(25)
  const marks = [0, 25, 50, 75, 100].map(value => ({ value, label: String(value) }))
</script>

<template>
  <Stack gap="lg" class="w-72 max-w-full">
    <Stack v-for="dir in ['ltr', 'rtl'] as const" :key="dir" gap="xs">
      <Text size="sm" tone="muted">{{ dir.toUpperCase() }}</Text>
      <Slider
        v-model="value"
        :dir="dir"
        :marks="marks"
        :step="5"
        :aria-label="'数值 (' + dir.toUpperCase() + ')'"
      />
    </Stack>
  </Stack>
</template>
