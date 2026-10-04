<script setup lang="ts">
  import { Slider, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="sm" class="w-64">
    <Slider size="sm" :model-value="30" aria-label="小号" />
    <Slider size="md" :model-value="50" aria-label="中号" />
    <Slider size="lg" :model-value="70" aria-label="大号" />
  </Stack>
</template>
