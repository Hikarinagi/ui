<script setup lang="ts">
  import { Heading, Inline, Stack, Text } from '@hina-ui/vue'

  const aligns = ['start', 'center', 'end', 'baseline', 'stretch'] as const
</script>

<template>
  <Stack>
    <Stack v-for="align in aligns" :key="align" gap="xs">
      <Text tone="muted" size="sm">{{ align }}</Text>
      <Inline :align="align" class="bg-inset rounded-md p-3">
        <Heading :level="3" size="xl">Heading</Heading>
        <Text>Body</Text>
        <Text tone="muted" size="sm">Note</Text>
      </Inline>
    </Stack>
  </Stack>
</template>
