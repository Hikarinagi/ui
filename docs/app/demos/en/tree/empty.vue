<script setup lang="ts">
  import { Stack, Text, Tree } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-80 max-w-full">
    <Tree :items="[]" aria-label="Default empty state" />
    <Tree :items="[]" aria-label="Custom empty state">
      <template #empty><Text size="sm" tone="muted">No nodes yet</Text></template>
    </Tree>
  </Stack>
</template>
