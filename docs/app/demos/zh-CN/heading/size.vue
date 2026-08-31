<script setup lang="ts">
  import { Heading, Stack } from '@hikarinagi/ui'
</script>

<template>
  <Stack class="max-w-lg">
    <Heading :level="3" size="2xl">三级标题，一级字号</Heading>
    <Heading :level="1" size="base">一级标题，正文字号</Heading>
  </Stack>
</template>
