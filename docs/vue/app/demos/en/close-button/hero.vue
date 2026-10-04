<script setup lang="ts">
  import { Card, CloseButton, Heading, Inline, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Card padded class="w-full max-w-sm">
    <Inline align="start" justify="between" :wrap="false" class="gap-4">
      <Stack gap="xs">
        <Heading :level="3" size="sm">A new version is available</Heading>
        <Text tone="muted" size="sm">Reload the page to get the latest features.</Text>
      </Stack>
      <CloseButton class="-mt-1.5 -me-1.5 shrink-0" />
    </Inline>
  </Card>
</template>
