<script setup lang="ts">
  import { Card, CloseButton, Heading, Text } from '@hikarinagi/ui'
</script>

<template>
  <Card padded class="w-full max-w-sm">
    <div class="flex items-start justify-between gap-4">
      <div class="flex flex-col gap-1">
        <Heading :level="3" size="sm">有新版本可用</Heading>
        <Text tone="muted" size="sm">刷新页面后即可使用最新功能。</Text>
      </div>
      <CloseButton class="-mt-1.5 -me-1.5 shrink-0" />
    </div>
  </Card>
</template>
