<script setup lang="ts">
  import { Button, Drawer, Inline, Text } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Drawer
      v-for="size in ['sm', 'md', 'lg'] as const"
      :key="size"
      :size="size"
      :title="`Size ${size}`"
    >
      <Button variant="outline" tone="neutral">{{ size }}</Button>
      <template #content>
        <Text>The width follows size, while the height always fills the screen.</Text>
      </template>
    </Drawer>
  </Inline>
</template>
