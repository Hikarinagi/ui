<script setup lang="ts">
  import { Settings } from '@lucide/vue'
  import { Button, Inline, Drawer, Tag, Text } from '@hina-ui/vue'
</script>

<template>
  <Drawer title="面板标题">
    <Button variant="outline" tone="neutral">标题插槽</Button>
    <template #icon><Settings /></template>
    <template #title>
      <Inline as="span" :wrap="false" class="inline-flex gap-2">
        自定义标题
        <Tag size="sm" tone="neutral">可选</Tag>
      </Inline>
    </template>
    <template #content>
      <Text>图标独立显示，标题插槽可以组合文字和标签。</Text>
    </template>
  </Drawer>
</template>
