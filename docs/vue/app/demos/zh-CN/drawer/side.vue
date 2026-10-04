<script setup lang="ts">
  import { Button, Drawer, Inline, Text } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Drawer title="从起始边展开" side="start">
      <Button variant="outline" tone="neutral">start</Button>
      <template #content>
        <Text>中文与英文环境下贴左缘，阿拉伯语等从右到左的语言下贴右缘。</Text>
      </template>
    </Drawer>
    <Drawer title="从结束边展开" side="end">
      <Button variant="outline" tone="neutral">end</Button>
      <template #content>
        <Text>默认值，中文与英文环境下贴右缘。</Text>
      </template>
    </Drawer>
  </Inline>
</template>
