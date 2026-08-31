<script setup lang="ts">
  import { Stack, Text, Time } from '@hikarinagi/ui'

  const now = Date.now()
  const items = [
    { label: '10 秒前', value: now - 10 * 1000 },
    { label: '3 分钟前', value: now - 3 * 60 * 1000 },
    { label: '5 小时前', value: now - 5 * 60 * 60 * 1000 },
    { label: '2 天后', value: now + 2 * 24 * 60 * 60 * 1000 },
  ]
</script>

<template>
  <Stack class="max-w-sm" gap="xs">
    <Text v-for="item in items" :key="item.label" size="sm">
      {{ item.label }}：
      <Time :value="item.value" format="relative" />
    </Text>
  </Stack>
</template>
