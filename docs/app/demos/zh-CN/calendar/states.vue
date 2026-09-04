<script setup lang="ts">
  import { Calendar, Inline } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="lg" align="start">
    <Calendar model-value="2026-09-04" readonly />
    <Calendar model-value="2026-09-04" disabled />
  </Inline>
</template>
