<script setup lang="ts">
  import { Inline, RingProgress } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="lg" align="center">
    <RingProgress :value="70" />
    <RingProgress :value="70" tone="neutral" />
    <RingProgress :value="100" tone="success" />
    <RingProgress :value="70" tone="warning" />
    <RingProgress :value="70" tone="danger" />
    <RingProgress :value="70" tone="info" />
  </Inline>
</template>
