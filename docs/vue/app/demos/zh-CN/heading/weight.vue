<script setup lang="ts">
  import { Heading, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="max-w-lg">
    <Heading :level="3" weight="semibold">半粗，默认字重</Heading>
    <Heading :level="3" weight="medium">中等字重</Heading>
    <Heading :level="3" weight="normal">常规字重</Heading>
  </Stack>
</template>
