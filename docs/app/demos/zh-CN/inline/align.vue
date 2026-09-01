<script setup lang="ts">
  import { Heading, Inline, Stack, Text } from '@hikarinagi/ui'

  const aligns = ['start', 'center', 'end', 'baseline', 'stretch'] as const
</script>

<template>
  <Stack>
    <Stack v-for="align in aligns" :key="align" gap="xs">
      <Text tone="muted" size="sm">{{ align }}</Text>
      <Inline :align="align" class="bg-inset rounded-md p-3">
        <Heading :level="3" size="xl">标题</Heading>
        <Text>正文</Text>
        <Text tone="muted" size="sm">附注</Text>
      </Inline>
    </Stack>
  </Stack>
</template>
