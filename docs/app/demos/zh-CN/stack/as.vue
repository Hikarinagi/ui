<script setup lang="ts">
  import { Card, Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <Stack as="ul" gap="sm" class="w-full max-w-xs">
    <Card as="li">列表项渲染为 li</Card>
    <Card as="li">容器渲染为 ul</Card>
  </Stack>
</template>
