<script setup lang="ts">
  import { NumberFormat, Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <Stack class="max-w-sm">
    <Text>
      收藏
      <NumberFormat :value="128456" format="compact" />
      次，好评率
      <NumberFormat :value="0.964" format="percent" :precision="1" />
    </Text>
    <Text tone="muted">
      定价
      <NumberFormat :value="1280" format="currency" currency="CNY" />
    </Text>
  </Stack>
</template>
