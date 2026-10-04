<script setup lang="ts">
  import { AspectRatio, Card, Image, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Card class="w-full max-w-xs" :padded="false">
    <AspectRatio :ratio="3 / 4" class="overflow-hidden rounded-t-lg">
      <Image src="/sample.webp" alt="ATRI" class="size-full" />
    </AspectRatio>
    <Stack gap="xs" class="p-4">
      <Text class="font-medium">ATRI</Text>
      <Text tone="muted" size="sm">封面按 3:4 裁切，不同尺寸的原图都能对齐。</Text>
    </Stack>
  </Card>
</template>
