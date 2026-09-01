<script setup lang="ts">
  import { Button, Card, Inline, Stack, Text } from '@hikarinagi/ui'

  const aligns = ['start', 'center', 'end', 'stretch'] as const
</script>

<template>
  <Inline align="start" class="gap-6">
    <Stack v-for="align in aligns" :key="align" gap="xs" class="w-40">
      <Text tone="muted" size="sm">{{ align }}</Text>
      <Stack :align="align" gap="sm" class="bg-inset rounded-md p-3">
        <Button size="sm" variant="soft" tone="neutral">短</Button>
        <Button size="sm" variant="soft" tone="neutral">长一点的按钮</Button>
      </Stack>
    </Stack>
  </Inline>
</template>
