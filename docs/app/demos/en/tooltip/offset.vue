<script setup lang="ts">
  import { Button, Inline, Tooltip } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Tooltip content="sideOffset is 0" :side-offset="0">
      <Button variant="outline" tone="neutral">Flush</Button>
    </Tooltip>
    <Tooltip content="sideOffset is 16" :side-offset="16">
      <Button variant="outline" tone="neutral">Further away</Button>
    </Tooltip>
  </Inline>
</template>
