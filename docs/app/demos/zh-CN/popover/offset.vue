<script setup lang="ts">
  import { Button, Inline, Popover, Text } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Popover :side-offset="0">
      <Button variant="outline" tone="neutral">紧贴</Button>
      <template #content>
        <Text size="sm">sideOffset 为 0。</Text>
      </template>
    </Popover>
    <Popover :side-offset="16">
      <Button variant="outline" tone="neutral">远离</Button>
      <template #content>
        <Text size="sm">sideOffset 为 16。</Text>
      </template>
    </Popover>
  </Inline>
</template>
