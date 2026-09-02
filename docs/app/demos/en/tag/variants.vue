<script setup lang="ts">
  import { Inline, Stack, Tag } from '@hina-ui/vue'
</script>

<template>
  <Stack align="center">
    <Inline align="center">
      <Tag variant="soft">Soft</Tag>
      <Tag variant="soft" tone="accent">Soft</Tag>
      <Tag variant="soft" tone="danger">Soft</Tag>
    </Inline>
    <Inline align="center">
      <Tag variant="solid">Solid</Tag>
      <Tag variant="solid" tone="accent">Solid</Tag>
      <Tag variant="solid" tone="danger">Solid</Tag>
    </Inline>
    <Inline align="center">
      <Tag variant="outline">Outline</Tag>
      <Tag variant="outline" tone="accent">Outline</Tag>
      <Tag variant="outline" tone="danger">Outline</Tag>
    </Inline>
  </Stack>
</template>
