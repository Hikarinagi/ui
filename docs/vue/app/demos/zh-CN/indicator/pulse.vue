<script setup lang="ts">
  import { Indicator, Inline, Text } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="lg" align="center">
    <Inline gap="sm" align="center">
      <Indicator tone="danger" pulse />
      <Text>直播中</Text>
    </Inline>
    <Inline gap="sm" align="center">
      <Indicator tone="accent" size="lg" pulse />
      <Text>正在更新</Text>
    </Inline>
  </Inline>
</template>
