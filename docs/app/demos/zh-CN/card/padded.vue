<script setup lang="ts">
  import { Card, Heading, Image, Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <Card :padded="false" class="w-full max-w-sm overflow-hidden">
    <Image src="/sample.webp" alt="夏日午后的坡道" class="h-32 w-full" />
    <Stack gap="xs" class="p-[var(--hn-panel-p)]">
      <Heading :level="3" size="base">通向车站的那条坡道</Heading>
      <Text tone="muted" size="sm">图片贴合卡片边缘，内边距改由内部容器提供。</Text>
    </Stack>
  </Card>
</template>
