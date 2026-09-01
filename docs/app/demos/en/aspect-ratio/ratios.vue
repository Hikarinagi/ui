<script setup lang="ts">
  import { AspectRatio, Inline, Stack, Text } from '@hikarinagi/ui'

  const ratios = [
    { label: '1 / 1', value: 1 },
    { label: '4 / 3', value: 4 / 3 },
    { label: '16 / 9', value: 16 / 9 },
    { label: '3 / 4', value: 3 / 4 },
  ]
</script>

<template>
  <Inline align="start" class="gap-4">
    <Stack v-for="ratio in ratios" :key="ratio.label" gap="xs" class="w-32">
      <Text tone="muted" size="sm">{{ ratio.label }}</Text>
      <AspectRatio :ratio="ratio.value" class="bg-inset overflow-hidden rounded-md">
        <img src="/avatars/peek.webp" alt="Shion Hoshimi" />
      </AspectRatio>
    </Stack>
  </Inline>
</template>
