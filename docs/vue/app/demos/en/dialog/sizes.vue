<script setup lang="ts">
  import { Button, Dialog, Inline, Text } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Dialog
      v-for="size in ['sm', 'md', 'lg', 'xl', '2xl'] as const"
      :key="size"
      :size="size"
      :title="`Size ${size}`"
    >
      <Button variant="outline" tone="neutral">{{ size }}</Button>
      <template #content>
        <Text>The width follows size, while the height never runs past the viewport.</Text>
      </template>
    </Dialog>
  </Inline>
</template>
