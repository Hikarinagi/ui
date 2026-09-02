<script setup lang="ts">
  import { Button, Inline, Tooltip, TooltipProvider } from '@hina-ui/vue'
</script>

<template>
  <TooltipProvider :delay-duration="600" :skip-delay-duration="0">
    <Inline align="center" class="gap-6">
      <Tooltip content="Appears after 600 milliseconds">
        <Button variant="outline" tone="neutral">Slower</Button>
      </Tooltip>
      <Tooltip content="Also waits 600 milliseconds">
        <Button variant="outline" tone="neutral">Another one</Button>
      </Tooltip>
    </Inline>
  </TooltipProvider>
</template>
