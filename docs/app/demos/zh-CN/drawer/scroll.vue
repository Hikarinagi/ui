<script setup lang="ts">
  import { Button, Drawer, Stack, Text } from '@hikarinagi/ui'

  const items = Array.from(
    { length: 30 },
    (_, i) => `第 ${i + 1} 条通知：这是一段用于占位的文字，好让正文足够长，能够看到滚动。`,
  )
</script>

<template>
  <Drawer title="全部通知" description="标题与页脚固定，中间的列表可以滚动。">
    <Button variant="outline" tone="neutral">查看全部</Button>
    <template #content>
      <Stack gap="sm">
        <Text v-for="item in items" :key="item">{{ item }}</Text>
      </Stack>
    </template>
    <template #footer="{ close }">
      <Button variant="soft" tone="neutral" @click="close">全部标为已读</Button>
    </template>
  </Drawer>
</template>
