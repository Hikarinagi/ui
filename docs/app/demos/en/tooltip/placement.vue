<script setup lang="ts">
  import { Button, Inline, Tooltip } from '@hikarinagi/ui'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Tooltip content="Floats overhead" side="top">
      <Button variant="outline" tone="neutral">top</Button>
    </Tooltip>
    <Tooltip content="Floats to the right" side="right">
      <Button variant="outline" tone="neutral">right</Button>
    </Tooltip>
    <Tooltip content="Floats below" side="bottom">
      <Button variant="outline" tone="neutral">bottom</Button>
    </Tooltip>
    <Tooltip content="Lined up with the start edge" side="top" align="start">
      <Button variant="outline" tone="neutral">top start</Button>
    </Tooltip>
  </Inline>
</template>
