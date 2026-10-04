<script setup lang="ts">
  import { DateField, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-72">
    <DateField size="sm" model-value="2026-09-04" aria-label="小号" />
    <DateField size="md" model-value="2026-09-04" aria-label="中号" />
    <DateField size="lg" model-value="2026-09-04" aria-label="大号" />
  </Stack>
</template>
