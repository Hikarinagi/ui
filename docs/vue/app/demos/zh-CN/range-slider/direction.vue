<script setup lang="ts">
  import { ref } from 'vue'
  import { RangeSlider, Stack, Text } from '@hina-ui/vue'

  const value = ref<[number, number]>([25, 75])
  const marks = [0, 25, 50, 75, 100].map(value => ({ value, label: String(value) }))
</script>

<template>
  <Stack gap="lg" class="w-72 max-w-full">
    <Stack v-for="dir in ['ltr', 'rtl'] as const" :key="dir" gap="xs">
      <Text size="sm" tone="muted">{{ dir.toUpperCase() }}</Text>
      <RangeSlider
        v-model="value"
        :dir="dir"
        :marks="marks"
        :step="5"
        :aria-label="'区间 (' + dir.toUpperCase() + ')'"
      />
    </Stack>
  </Stack>
</template>
