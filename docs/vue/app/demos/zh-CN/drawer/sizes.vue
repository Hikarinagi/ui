<script setup lang="ts">
  import { Button, Drawer, Inline, Text } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Drawer
      v-for="size in ['sm', 'md', 'lg'] as const"
      :key="size"
      :size="size"
      :title="`${size} 档`"
    >
      <Button variant="outline" tone="neutral">{{ size }}</Button>
      <template #content>
        <Text>抽屉的宽度随 size 变化，高度始终占满屏幕。</Text>
      </template>
    </Drawer>
  </Inline>
</template>
