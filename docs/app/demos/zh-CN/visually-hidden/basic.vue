<script setup lang="ts">
  import { Stack, Text, VisuallyHidden } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="sm">
    <Text>
      当前评分 8.9
      <VisuallyHidden>，满分 10 分</VisuallyHidden>
    </Text>
    <Text size="sm" tone="faint">括号内的补充只有屏幕阅读器会读到。</Text>
  </Stack>
</template>
