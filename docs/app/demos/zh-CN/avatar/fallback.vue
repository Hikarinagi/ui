<script setup lang="ts">
  import { Avatar, Inline, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Inline align="start" class="gap-8">
    <Stack gap="xs" align="center">
      <Avatar name="星见书音" />
      <Text tone="muted" size="sm">中文取首字</Text>
    </Stack>
    <Stack gap="xs" align="center">
      <Avatar name="Shion Hoshimi" />
      <Text tone="muted" size="sm">西文取两个首字母</Text>
    </Stack>
    <Stack gap="xs" align="center">
      <Avatar />
      <Text tone="muted" size="sm">没有名字时用图标</Text>
    </Stack>
    <Stack gap="xs" align="center">
      <Avatar src="/missing.png" name="星见书音" />
      <Text tone="muted" size="sm">图片加载失败</Text>
    </Stack>
  </Inline>
</template>
