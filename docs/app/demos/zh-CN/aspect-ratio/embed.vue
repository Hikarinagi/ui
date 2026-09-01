<script setup lang="ts">
  import { AspectRatio, Center, Text } from '@hikarinagi/ui'
</script>

<template>
  <AspectRatio class="bg-inset w-full max-w-md overflow-hidden rounded-md">
    <Center class="size-full">
      <Text tone="muted" size="sm">此处可放置 iframe 或 video，它会占满整个框</Text>
    </Center>
  </AspectRatio>
</template>
