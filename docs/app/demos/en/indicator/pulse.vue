<script setup lang="ts">
  import { Indicator, Inline, Text } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="lg" align="center">
    <Inline gap="sm" align="center">
      <Indicator tone="danger" pulse />
      <Text>Live</Text>
    </Inline>
    <Inline gap="sm" align="center">
      <Indicator tone="accent" size="lg" pulse />
      <Text>Updating</Text>
    </Inline>
  </Inline>
</template>
