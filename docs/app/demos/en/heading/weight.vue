<script setup lang="ts">
  import { Heading, Stack } from '@hikarinagi/ui'
</script>

<template>
  <Stack class="max-w-lg">
    <Heading :level="3" weight="semibold">Semibold, the default</Heading>
    <Heading :level="3" weight="medium">Medium weight</Heading>
    <Heading :level="3" weight="normal">Regular weight</Heading>
  </Stack>
</template>
