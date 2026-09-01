<script setup lang="ts">
  import { AspectRatio, Card, Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <Card class="w-full max-w-xs" :padded="false">
    <AspectRatio :ratio="3 / 4" class="overflow-hidden rounded-t-lg">
      <img src="/sample.webp" alt="Beyond the Stars" />
    </AspectRatio>
    <Stack gap="xs" class="p-4">
      <Text class="font-medium">Beyond the Stars</Text>
      <Text tone="muted" size="sm">
        Covers are cropped to 3:4, so originals of any size line up.
      </Text>
    </Stack>
  </Card>
</template>
