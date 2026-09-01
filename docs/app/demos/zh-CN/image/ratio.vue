<script setup lang="ts">
  import { Image, Inline, Stack, Text } from '@hikarinagi/ui'

  const ratios = [
    { label: '1 / 1', value: 1 },
    { label: '4 / 3', value: 4 / 3 },
    { label: '16 / 9', value: 16 / 9 },
  ]
</script>

<template>
  <Inline align="start" class="gap-4">
    <Stack v-for="ratio in ratios" :key="ratio.label" gap="xs" class="w-40">
      <Text tone="muted" size="sm">{{ ratio.label }}</Text>
      <Image src="/sample.webp" alt="夏日午后的坡道" :ratio="ratio.value" class="rounded-md" />
    </Stack>
  </Inline>
</template>
