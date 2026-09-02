<script setup lang="ts">
  import { Indicator, Inline } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="lg" align="center">
    <Indicator />
    <Indicator tone="accent" />
    <Indicator tone="success" />
    <Indicator tone="warning" />
    <Indicator tone="danger" />
    <Indicator tone="info" />
  </Inline>
</template>
