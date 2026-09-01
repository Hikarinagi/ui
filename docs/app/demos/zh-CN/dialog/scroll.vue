<script setup lang="ts">
  import { Button, Dialog, Stack, Text } from '@hikarinagi/ui'

  const terms = Array.from(
    { length: 30 },
    (_, i) =>
      `第 ${i + 1} 条：使用本服务即表示你同意这一条款，它在这里只用于占位，好让正文足够长，能够看到滚动。`,
  )
</script>

<template>
  <Dialog title="服务条款" description="请阅读之后再继续。">
    <Button variant="outline" tone="neutral">查看条款</Button>
    <template #content>
      <Stack gap="sm">
        <Text v-for="line in terms" :key="line">{{ line }}</Text>
      </Stack>
    </template>
    <template #footer="{ close }">
      <Button variant="soft" tone="neutral" @click="close">拒绝</Button>
      <Button @click="close">同意</Button>
    </template>
  </Dialog>
</template>
