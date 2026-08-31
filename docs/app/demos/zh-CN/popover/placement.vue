<script setup lang="ts">
  import { Button, Inline, Popover, Text } from '@hikarinagi/ui'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Popover align="start">
      <Button variant="outline" tone="neutral">start</Button>
      <template #content>
        <Text size="sm">与触发器的起始边对齐。</Text>
      </template>
    </Popover>
    <Popover align="center">
      <Button variant="outline" tone="neutral">center</Button>
      <template #content>
        <Text size="sm">与触发器居中对齐。</Text>
      </template>
    </Popover>
    <Popover side="right" align="start">
      <Button variant="outline" tone="neutral">right</Button>
      <template #content>
        <Text size="sm">在触发器右侧展开。</Text>
      </template>
    </Popover>
    <Popover side="top">
      <Button variant="outline" tone="neutral">top</Button>
      <template #content>
        <Text size="sm">在触发器上方展开。</Text>
      </template>
    </Popover>
  </Inline>
</template>
