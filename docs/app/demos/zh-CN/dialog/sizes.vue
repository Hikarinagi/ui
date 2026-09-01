<script setup lang="ts">
  import { Button, Dialog, Inline, Text } from '@hikarinagi/ui'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Dialog
      v-for="size in ['sm', 'md', 'lg'] as const"
      :key="size"
      :size="size"
      :title="`${size} 档`"
    >
      <Button variant="outline" tone="neutral">{{ size }}</Button>
      <template #content>
        <Text>面板宽度随 size 变化，高度始终不超出视口。</Text>
      </template>
    </Dialog>
  </Inline>
</template>
