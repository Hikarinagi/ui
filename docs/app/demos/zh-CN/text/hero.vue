<script setup lang="ts">
  import { Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <Stack class="max-w-lg">
    <Text size="md">导语用 md，比正文略大。</Text>
    <Text>正文用 base，界面上九成的文字都是它。</Text>
    <Text size="sm" tone="muted">辅助说明用 sm 与次级色。</Text>
  </Stack>
</template>
