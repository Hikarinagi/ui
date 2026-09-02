<script setup lang="ts">
  import { Card, Inline, Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <Inline align="start" class="w-full max-w-lg">
    <Card class="flex-1">
      <Stack gap="xs">
        <Text size="sm" tone="faint">comfortable</Text>
        <Text>内边距 20px</Text>
      </Stack>
    </Card>
    <Card data-density="compact" class="flex-1">
      <Stack gap="xs">
        <Text size="sm" tone="faint">compact</Text>
        <Text>内边距 14px</Text>
      </Stack>
    </Card>
  </Inline>
</template>
