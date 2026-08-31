<script setup lang="ts">
  import { Info } from '@lucide/vue'
  import { IconButton, Inline, Link, Popover, Text } from '@hikarinagi/ui'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Popover>
      <IconButton variant="ghost" tone="neutral" label="Show notes" :tooltip="false">
        <Info />
      </IconButton>
      <template #content>
        <Text size="sm">The trigger here is an icon button.</Text>
      </template>
    </Popover>
    <Popover align="start">
      <Link href="#">Shion Hoshimi</Link>
      <template #content>
        <Text size="sm">The trigger here is a piece of inline link text.</Text>
      </template>
    </Popover>
  </Inline>
</template>
