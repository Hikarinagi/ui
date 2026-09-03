<script setup lang="ts">
  import { RangeSlider, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="sm" class="w-64">
    <RangeSlider size="sm" :model-value="[20, 60]" aria-label="Small" />
    <RangeSlider size="md" :model-value="[20, 60]" aria-label="Medium" />
    <RangeSlider size="lg" :model-value="[20, 60]" aria-label="Large" />
  </Stack>
</template>
