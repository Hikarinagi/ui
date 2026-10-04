<script setup lang="ts">
  import { Image, Inline, Stack, Text } from '@hina-ui/vue'

  const image = {
    thumbnail: '/sample-thumbnail.webp',
    original: '/sample.webp',
    width: 1200,
    height: 675,
  }
</script>

<template>
  <Inline align="start" class="gap-6">
    <Stack gap="sm" class="w-64">
      <Text size="sm" tone="muted">Detect dimensions</Text>
      <Image
        :src="image.thumbnail"
        :preview="image.original"
        alt="A hillside on a summer afternoon"
        :ratio="16 / 9"
        class="rounded-xl"
      />
    </Stack>
    <Stack gap="sm" class="w-64">
      <Text size="sm" tone="muted">Known dimensions</Text>
      <Image
        :src="image.thumbnail"
        :preview="image.original"
        :preview-size="{ width: image.width, height: image.height }"
        alt="A hillside on a summer afternoon"
        :ratio="16 / 9"
        class="rounded-xl"
      />
    </Stack>
  </Inline>
</template>
