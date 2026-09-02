<script setup lang="ts">
  import { Indicator, Inline, Text } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="lg" align="center">
    <Inline gap="sm" align="center">
      <Indicator tone="success" pulse />
      <Text>Ongoing</Text>
    </Inline>
    <Inline gap="sm" align="center">
      <Indicator tone="info" />
      <Text>Finished</Text>
    </Inline>
    <Inline gap="sm" align="center">
      <Indicator tone="danger" />
      <Text>Dropped</Text>
    </Inline>
    <Inline gap="sm" align="center">
      <Indicator />
      <Text>Not started</Text>
    </Inline>
  </Inline>
</template>
