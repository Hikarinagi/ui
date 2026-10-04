<script setup lang="ts">
  import { Button, Sheet, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Sheet title="用户协议" description="请阅读全文后再同意。">
    <Button variant="outline" tone="neutral">查看协议</Button>
    <template #content>
      <Stack gap="md">
        <Text v-for="n in 24" :key="n">
          第 {{ n }} 条：本条款用于演示面板内部的滚动，标题与页脚保持不动，正文在中间滚动。
        </Text>
      </Stack>
    </template>
    <template #footer="{ close }">
      <Button @click="close">同意</Button>
    </template>
  </Sheet>
</template>
