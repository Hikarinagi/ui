<script setup lang="ts">
  import { Card, Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <Stack class="w-full max-w-sm">
    <Card as="article">
      <Text>独立成篇、可单独发布的内容使用 article</Text>
    </Card>
    <Card as="section">
      <Text>页面中的一个区块使用 section</Text>
    </Card>
  </Stack>
</template>
