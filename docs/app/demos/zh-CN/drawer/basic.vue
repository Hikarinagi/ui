<script setup lang="ts">
  import { Button, Drawer, Text } from '@hikarinagi/ui'
</script>

<template>
  <Drawer title="通知" description="最近七天的消息。">
    <Button variant="outline" tone="neutral">打开通知</Button>
    <template #content>
      <Text>这里放置消息列表，抽屉贴着屏幕边缘展开，四角保持直角。</Text>
    </template>
  </Drawer>
</template>
