<script setup lang="ts">
  import { Heading, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="max-w-lg">
    <Heading :level="1">一级标题</Heading>
    <Heading :level="2">二级标题</Heading>
    <Heading :level="3">三级标题</Heading>
    <Heading :level="4">四级标题</Heading>
    <Heading :level="5">五级标题</Heading>
    <Heading :level="6">六级标题</Heading>
  </Stack>
</template>
