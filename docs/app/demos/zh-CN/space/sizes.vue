<script setup lang="ts">
  import { Card, Inline, Space, Stack, Text } from '@hikarinagi/ui'

  const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
</script>

<template>
  <Stack>
    <Stack v-for="size in sizes" :key="size" gap="xs">
      <Text tone="muted" size="sm">{{ size }}</Text>
      <Inline gap="none" class="bg-inset w-fit rounded-md p-2">
        <Card class="bg-surface size-8" :padded="false" />
        <Space :size="size" />
        <Card class="bg-surface size-8" :padded="false" />
      </Inline>
    </Stack>
  </Stack>
</template>
