<script setup lang="ts">
  import { Card, Heading, Ripple, Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <Card as="button" class="hn-interactive hn-state-layer hn-press-lg w-full max-w-sm text-start">
    <Ripple />
    <Stack gap="xs">
      <Heading :level="3" size="base">The whole card is one press target</Heading>
      <Text tone="muted" size="sm">
        Ink on hover and a ripple on press — the caller opts into both.
      </Text>
    </Stack>
  </Card>
</template>
