<script setup lang="ts">
  import { Inline, RingProgress } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="xl" align="start">
    <RingProgress :value="58" show-value label="已读" />
    <RingProgress :value="91" show-value label="已收藏" tone="info" />
  </Inline>
</template>
