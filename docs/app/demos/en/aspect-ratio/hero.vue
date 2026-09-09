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
      <Text tone="muted" size="sm">
        Covers are cropped to 3:4, so originals of any size line up.
      </Text>
    </Stack>
  </Card>
</template>
