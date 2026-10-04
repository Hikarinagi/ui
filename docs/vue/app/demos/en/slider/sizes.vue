<script setup lang="ts">
  import { Slider, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="sm" class="w-64">
    <Slider size="sm" :model-value="30" aria-label="Small" />
    <Slider size="md" :model-value="50" aria-label="Medium" />
    <Slider size="lg" :model-value="70" aria-label="Large" />
  </Stack>
</template>
