<script setup lang="ts">
  import { Image, Stack, Text, provideImageResolver } from '@hina-ui/vue'

  provideImageResolver(src => `${src}?preset=banner&quality=82`)
</script>

<template>
  <Stack class="w-full max-w-md">
    <Image
      src="/sample.webp"
      alt="A slope on a summer afternoon"
      :ratio="16 / 9"
      class="rounded-md"
    />
    <Text tone="muted" size="sm">
      The resolver above appends a query string; a real application would point the address at a CDN
      and an image processor instead.
    </Text>
  </Stack>
</template>
