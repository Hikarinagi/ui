<script setup lang="ts">
  import { Inline, RingProgress } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="lg" align="center">
    <RingProgress :value="40" />
    <RingProgress :value="40" show-value />
  </Inline>
</template>
