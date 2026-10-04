<script setup lang="ts">
  import { Button, Dialog, Text } from '@hina-ui/vue'
</script>

<template>
  <Dialog title="导出数据" description="选择一种格式，导出当前的筛选结果。">
    <Button variant="outline" tone="neutral">打开对话框</Button>
    <template #content>
      <Text tone="muted">右上角的关闭按钮由 Dialog 内置，无需重复添加。</Text>
    </template>
  </Dialog>
</template>
