<script setup lang="ts">
  import { Button, Inline, Tooltip, TooltipProvider } from '@hina-ui/vue'
</script>

<template>
  <TooltipProvider :delay-duration="600" :skip-delay-duration="0">
    <Inline align="center" class="gap-6">
      <Tooltip content="等待 600 毫秒后出现">
        <Button variant="outline" tone="neutral">慢一点</Button>
      </Tooltip>
      <Tooltip content="同样等待 600 毫秒">
        <Button variant="outline" tone="neutral">再一个</Button>
      </Tooltip>
    </Inline>
  </TooltipProvider>
</template>
