<script setup lang="ts">
  import { Button, Inline, Sheet, Text } from '@hina-ui/vue'
</script>

<template>
  <Inline>
    <Sheet
      v-for="handle in [true, false]"
      :key="String(handle)"
      title="隐藏标题栏"
      description="标题与说明仍保留为无障碍内容。"
      :header="false"
      :handle="handle"
    >
      <Button variant="outline" tone="neutral">{{ handle ? '保留把手' : '隐藏整个顶部' }}</Button>
      <template #content>
        <Text>正文直接显示在把手下方，或从面板内边距开始。</Text>
      </template>
      <template #footer="{ close }">
        <Button variant="soft" tone="neutral" @click="close">关闭</Button>
      </template>
    </Sheet>
  </Inline>
</template>
