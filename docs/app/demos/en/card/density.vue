<script setup lang="ts">
  import { Card, Inline, Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <Inline align="start" class="w-full max-w-lg">
    <Card class="flex-1">
      <Stack gap="xs">
        <Text size="sm" tone="faint">comfortable</Text>
        <Text>20px of padding</Text>
      </Stack>
    </Card>
    <Card data-density="compact" class="flex-1">
      <Stack gap="xs">
        <Text size="sm" tone="faint">compact</Text>
        <Text>14px of padding</Text>
      </Stack>
    </Card>
  </Inline>
</template>
