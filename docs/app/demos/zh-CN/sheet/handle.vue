<script setup lang="ts">
  import { Button, Sheet, Text } from '@hina-ui/vue'
</script>

<template>
  <Sheet title="没有把手" description="右上角改为关闭按钮，标题区域仍然可以拖动。" :handle="false">
    <Button variant="outline" tone="neutral">打开</Button>
    <template #content>
      <Text>按住标题向下拖动试试。</Text>
    </template>
  </Sheet>
</template>
