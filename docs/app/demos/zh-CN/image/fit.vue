<script setup lang="ts">
  import { Image, Inline, Stack, Text } from '@hina-ui/vue'

  const fits = ['cover', 'contain', 'fill'] as const
</script>

<template>
  <Inline align="start" class="gap-4">
    <Stack v-for="fit in fits" :key="fit" gap="xs" class="w-32">
      <Text tone="muted" size="sm">{{ fit }}</Text>
      <Image
        src="/sample.webp"
        alt="夏日午后的坡道"
        :fit="fit"
        :ratio="1"
        class="bg-inset rounded-md"
      />
    </Stack>
  </Inline>
</template>
