<script setup lang="ts">
  import { Calendar, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="lg" align="start">
    <Calendar size="sm" model-value="2026-09-04" />
    <Calendar size="md" model-value="2026-09-04" />
    <Calendar size="lg" model-value="2026-09-04" />
  </Stack>
</template>
