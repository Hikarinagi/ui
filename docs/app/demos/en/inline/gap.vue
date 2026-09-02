<script setup lang="ts">
  import { Card, Inline, Stack, Text } from '@hikarinagi/ui'

  const gaps = ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const
</script>

<template>
  <Stack>
    <Stack v-for="gap in gaps" :key="gap" gap="xs">
      <Text tone="muted" size="sm">{{ gap }}</Text>
      <Inline :gap="gap">
        <Card class="bg-inset size-8" :padded="false" />
        <Card class="bg-inset size-8" :padded="false" />
        <Card class="bg-inset size-8" :padded="false" />
      </Inline>
    </Stack>
  </Stack>
</template>
