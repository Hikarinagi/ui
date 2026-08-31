<script setup lang="ts">
  import { Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <Stack class="max-w-lg">
    <Text>默认渲染为 p 元素。</Text>
    <Text as="span" tone="muted">设置 as 可以改为 span，用于行内。</Text>
    <Text as="div" size="sm">也可以是 div。</Text>
  </Stack>
</template>
