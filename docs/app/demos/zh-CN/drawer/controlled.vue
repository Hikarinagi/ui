<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Drawer, Inline, Text } from '@hikarinagi/ui'

  const open = ref(false)
</script>

<template>
  <Inline align="center">
    <Button variant="outline" tone="neutral" @click="open = true">从外部打开</Button>
    <Text tone="muted" size="sm">当前：{{ open ? '已打开' : '已关闭' }}</Text>
    <Drawer v-model:open="open" title="没有触发器的抽屉" description="它由外部的状态控制。">
      <template #content>
        <Text>省略默认插槽时不渲染触发器，只能通过 open 打开。</Text>
      </template>
      <template #footer="{ close }">
        <Button @click="close">关闭</Button>
      </template>
    </Drawer>
  </Inline>
</template>
