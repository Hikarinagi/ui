<script setup lang="ts">
  import { Card, Inline, Stack, Text } from '@hikarinagi/ui'

  const gaps = ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const
</script>

<template>
  <Inline align="start" class="gap-8">
    <Stack v-for="gap in gaps" :key="gap" gap="xs">
      <Text tone="muted" size="sm">{{ gap }}</Text>
      <Stack :gap="gap">
        <Card class="bg-emphasis size-10" :padded="false" />
        <Card class="bg-emphasis size-10" :padded="false" />
        <Card class="bg-emphasis size-10" :padded="false" />
      </Stack>
    </Stack>
  </Inline>
</template>
