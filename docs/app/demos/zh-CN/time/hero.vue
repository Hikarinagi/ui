<script setup lang="ts">
  import { Stack, Text, Time } from '@hikarinagi/ui'

  const published = new Date('2026-03-14T09:30:00+08:00')
  const edited = new Date(Date.now() - 12 * 60 * 1000)
</script>

<template>
  <Stack class="max-w-sm">
    <Text>
      发布于
      <Time :value="published" />
    </Text>
    <Text tone="muted">
      最后编辑
      <Time :value="edited" format="relative" />
    </Text>
  </Stack>
</template>
