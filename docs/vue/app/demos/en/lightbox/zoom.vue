<script setup lang="ts">
  import { Image, ImageGroup, Inline, Stack, Text } from '@hina-ui/vue'

  const pictures = [
    { src: '/favicon.png', alt: 'Hina UI', size: '128 × 128' },
    { src: '/avatars/huh.webp', alt: 'Character portrait', size: '256 × 256' },
    { src: '/sample.webp', alt: 'A hillside on a summer afternoon', size: '1200 × 675' },
  ]
</script>

<template>
  <ImageGroup>
    <Inline align="start" class="gap-6">
      <Stack v-for="picture in pictures" :key="picture.src" gap="xs" class="w-32">
        <Image
          :src="picture.src"
          :alt="picture.alt"
          preview
          fit="contain"
          class="h-24 rounded-md"
        />
        <Text tone="muted" size="sm">{{ picture.size }}</Text>
      </Stack>
    </Inline>
  </ImageGroup>
</template>
