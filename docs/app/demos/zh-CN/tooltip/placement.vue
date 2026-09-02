<script setup lang="ts">
  import { Button, Inline, Tooltip } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Tooltip content="浮在头顶" side="top">
      <Button variant="outline" tone="neutral">top</Button>
    </Tooltip>
    <Tooltip content="浮在右侧" side="right">
      <Button variant="outline" tone="neutral">right</Button>
    </Tooltip>
    <Tooltip content="浮在下方" side="bottom">
      <Button variant="outline" tone="neutral">bottom</Button>
    </Tooltip>
    <Tooltip content="与起始边对齐" side="top" align="start">
      <Button variant="outline" tone="neutral">top start</Button>
    </Tooltip>
  </Inline>
</template>
