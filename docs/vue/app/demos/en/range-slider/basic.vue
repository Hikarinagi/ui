<script setup lang="ts">
  import { ref } from 'vue'
  import { RangeSlider, Stack, Text } from '@hina-ui/vue'

  const year = ref<[number, number]>([2010, 2020])
</script>

<template>
  <Stack gap="sm" class="w-64">
    <RangeSlider v-model="year" :min="1990" :max="2026" aria-label="Years" />
    <Text size="sm" tone="muted">Value: {{ year[0] }} to {{ year[1] }}</Text>
  </Stack>
</template>
