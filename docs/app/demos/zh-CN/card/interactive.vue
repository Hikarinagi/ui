<script setup lang="ts">
  import { Card, Heading, Ripple, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Card as="button" class="hn-interactive hn-state-layer hn-press-lg w-full max-w-sm text-start">
    <Ripple />
    <Stack gap="xs">
      <Heading :level="3" size="base">整张卡片都是可点击区域</Heading>
      <Text tone="muted" size="sm">悬停时的状态层与按下时的波纹均由调用方添加。</Text>
    </Stack>
  </Card>
</template>
