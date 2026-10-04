<script setup lang="ts">
  import { Settings } from '@lucide/vue'
  import { Button, Dialog, Text } from '@hina-ui/vue'
</script>

<template>
  <Dialog title="对话框标题">
    <Button variant="outline" tone="neutral">标题插槽</Button>
    <template #icon><Settings /></template>
    <template #title>自定义标题</template>
    <template #content>
      <Text>图标与标题内容分别由插槽提供。</Text>
    </template>
  </Dialog>
</template>
