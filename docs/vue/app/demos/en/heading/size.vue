<script setup lang="ts">
  import { Heading, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="max-w-lg">
    <Heading :level="3" size="2xl">Level 3 tag, level 1 size</Heading>
    <Heading :level="1" size="base">Level 1 tag, body size</Heading>
  </Stack>
</template>
