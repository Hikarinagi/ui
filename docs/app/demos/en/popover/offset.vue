<script setup lang="ts">
  import { Button, Inline, Popover, Text } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Popover :side-offset="0">
      <Button variant="outline" tone="neutral">Flush</Button>
      <template #content>
        <Text size="sm">sideOffset is 0.</Text>
      </template>
    </Popover>
    <Popover :side-offset="16">
      <Button variant="outline" tone="neutral">Further away</Button>
      <template #content>
        <Text size="sm">sideOffset is 16.</Text>
      </template>
    </Popover>
  </Inline>
</template>
