<script setup lang="ts">
  import { Stack, Text, Tree } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-80 max-w-full">
    <Tree :items="[]" aria-label="默认空状态" />
    <Tree :items="[]" aria-label="自定义空状态">
      <template #empty><Text size="sm" tone="muted">还没有节点</Text></template>
    </Tree>
  </Stack>
</template>
