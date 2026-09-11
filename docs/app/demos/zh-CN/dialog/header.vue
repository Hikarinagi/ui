<script setup lang="ts">
  import { Button, Dialog, Text } from '@hina-ui/vue'
</script>

<template>
  <Dialog title="无头部" :header="false">
    <Button variant="outline" tone="neutral">无头部</Button>
    <template #content>
      <Text>标题保留为无障碍名称，正文与页脚正常显示。</Text>
    </template>
    <template #footer="{ close }">
      <Button @click="close">关闭</Button>
    </template>
  </Dialog>
</template>
