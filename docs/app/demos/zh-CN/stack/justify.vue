<script setup lang="ts">
  import { Button, Card, Heading, Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <Card class="h-64 w-full max-w-xs">
    <Stack justify="between" class="h-full">
      <Stack gap="xs">
        <Heading :level="3" size="md">存储空间</Heading>
        <Text tone="muted" size="sm">已用 12.4 GB，共 20 GB。</Text>
      </Stack>
      <Button variant="soft" tone="neutral">升级容量</Button>
    </Stack>
  </Card>
</template>
