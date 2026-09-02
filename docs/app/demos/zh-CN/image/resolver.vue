<script setup lang="ts">
  import { Image, Stack, Text, provideImageResolver } from '@hina-ui/vue'

  provideImageResolver(src => `${src}?preset=banner&quality=82`)
</script>

<template>
  <Stack class="w-full max-w-md">
    <Image src="/sample.webp" alt="夏日午后的坡道" :ratio="16 / 9" class="rounded-md" />
    <Text tone="muted" size="sm">
      这里的解析器为地址补充查询串，真实应用会将地址指向 CDN 与图片处理服务。
    </Text>
  </Stack>
</template>
