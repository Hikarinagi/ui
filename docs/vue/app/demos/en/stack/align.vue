<script setup lang="ts">
  import { Button, Inline, Stack, Text } from '@hina-ui/vue'

  const aligns = ['start', 'center', 'end', 'stretch'] as const
</script>

<template>
  <Inline align="start" class="gap-6">
    <Stack v-for="align in aligns" :key="align" gap="xs" class="w-44">
      <Text tone="muted" size="sm">{{ align }}</Text>
      <Stack :align="align" gap="sm" class="bg-inset rounded-md p-3">
        <Button size="sm" variant="soft" tone="neutral">Short</Button>
        <Button size="sm" variant="soft" tone="neutral">A longer button</Button>
      </Stack>
    </Stack>
  </Inline>
</template>
