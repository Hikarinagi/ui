<script setup lang="ts">
  import { Inline, Stack, Tag } from '@hina-ui/vue'
</script>

<template>
  <Stack align="center">
    <Inline align="center">
      <Tag variant="soft">浅色</Tag>
      <Tag variant="soft" tone="accent">浅色</Tag>
      <Tag variant="soft" tone="danger">浅色</Tag>
    </Inline>
    <Inline align="center">
      <Tag variant="solid">填充</Tag>
      <Tag variant="solid" tone="accent">填充</Tag>
      <Tag variant="solid" tone="danger">填充</Tag>
    </Inline>
    <Inline align="center">
      <Tag variant="outline">描边</Tag>
      <Tag variant="outline" tone="accent">描边</Tag>
      <Tag variant="outline" tone="danger">描边</Tag>
    </Inline>
  </Stack>
</template>
