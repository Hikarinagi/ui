<script setup lang="ts">
  import { Card, Heading, Image, Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <Card :padded="false" class="w-full max-w-sm overflow-hidden">
    <Image src="/sample.webp" alt="A slope on a summer afternoon" class="h-32 w-full" />
    <Stack gap="xs" class="p-[var(--hn-panel-p)]">
      <Heading :level="3" size="base">The slope down to the station</Heading>
      <Text tone="muted" size="sm">
        The image runs to the edge, and an inner container supplies the padding instead.
      </Text>
    </Stack>
  </Card>
</template>
