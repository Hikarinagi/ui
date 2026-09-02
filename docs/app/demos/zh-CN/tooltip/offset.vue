<script setup lang="ts">
  import { Button, Inline, Tooltip } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Tooltip content="sideOffset 为 0" :side-offset="0">
      <Button variant="outline" tone="neutral">紧贴</Button>
    </Tooltip>
    <Tooltip content="sideOffset 为 16" :side-offset="16">
      <Button variant="outline" tone="neutral">远离</Button>
    </Tooltip>
  </Inline>
</template>
