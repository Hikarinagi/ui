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
      <Text size="sm" tone="muted">自动获取尺寸</Text>
      <Image
        :src="image.thumbnail"
        :preview="image.original"
        alt="夏日午后的坡道"
        :ratio="16 / 9"
        class="rounded-xl"
      />
    </Stack>
    <Stack gap="sm" class="w-64">
      <Text size="sm" tone="muted">预先提供尺寸</Text>
      <Image
        :src="image.thumbnail"
        :preview="image.original"
        :preview-size="{ width: image.width, height: image.height }"
        alt="夏日午后的坡道"
        :ratio="16 / 9"
        class="rounded-xl"
      />
    </Stack>
  </Inline>
</template>
