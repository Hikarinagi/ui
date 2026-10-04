<script setup lang="ts">
  import { Inline, RingProgress } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="lg" align="center">
    <RingProgress :value="60" size="sm" show-value />
    <RingProgress :value="60" show-value />
    <RingProgress :value="60" size="lg" show-value />
  </Inline>
</template>
