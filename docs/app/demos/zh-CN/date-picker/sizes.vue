<script setup lang="ts">
  import { DatePicker, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-72">
    <DatePicker size="sm" model-value="2026-09-04" aria-label="小号" />
    <DatePicker size="md" model-value="2026-09-04" aria-label="中号" />
    <DatePicker size="lg" model-value="2026-09-04" aria-label="大号" />
  </Stack>
</template>
