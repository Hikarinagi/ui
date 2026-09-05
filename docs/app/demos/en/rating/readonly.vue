<script setup lang="ts">
  import { Inline, Rating, Text } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="sm">
    <Rating :model-value="4.3" readonly />
    <Text tone="muted" size="sm">4.3 from 128 ratings</Text>
  </Inline>
</template>
