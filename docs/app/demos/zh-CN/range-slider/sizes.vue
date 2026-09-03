<script setup lang="ts">
  import { RangeSlider, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="sm" class="w-64">
    <RangeSlider size="sm" :model-value="[20, 60]" aria-label="小号" />
    <RangeSlider size="md" :model-value="[20, 60]" aria-label="中号" />
    <RangeSlider size="lg" :model-value="[20, 60]" aria-label="大号" />
  </Stack>
</template>
