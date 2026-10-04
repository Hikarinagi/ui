<script setup lang="ts">
  import { Indicator, Inline, Text } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="lg" align="center">
    <Inline gap="sm" align="center">
      <Indicator tone="success" pulse />
      <Text>连载中</Text>
    </Inline>
    <Inline gap="sm" align="center">
      <Indicator tone="info" />
      <Text>已完结</Text>
    </Inline>
    <Inline gap="sm" align="center">
      <Indicator tone="danger" />
      <Text>已停更</Text>
    </Inline>
    <Inline gap="sm" align="center">
      <Indicator />
      <Text>未开始</Text>
    </Inline>
  </Inline>
</template>
