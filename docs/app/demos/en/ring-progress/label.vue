<script setup lang="ts">
  import { Inline, RingProgress } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="xl" align="start">
    <RingProgress :value="58" show-value label="Read" />
    <RingProgress :value="91" show-value label="Bookmarked" tone="info" />
  </Inline>
</template>
