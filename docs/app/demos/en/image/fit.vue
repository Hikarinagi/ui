<script setup lang="ts">
  import { Image, Inline, Stack, Text } from '@hikarinagi/ui'

  const fits = ['cover', 'contain', 'fill'] as const
</script>

<template>
  <Inline align="start" class="gap-4">
    <Stack v-for="fit in fits" :key="fit" gap="xs" class="w-32">
      <Text tone="muted" size="sm">{{ fit }}</Text>
      <Image
        src="/sample.webp"
        alt="A slope on a summer afternoon"
        :fit="fit"
        :ratio="1"
        class="bg-inset rounded-md"
      />
    </Stack>
  </Inline>
</template>
