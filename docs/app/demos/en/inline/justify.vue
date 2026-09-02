<script setup lang="ts">
  import { Button, Heading, Inline } from '@hina-ui/vue'
</script>

<template>
  <Inline justify="between" class="bg-inset w-full rounded-md p-3">
    <Heading :level="3" size="md">Reading history</Heading>
    <Button size="sm" variant="soft" tone="neutral">Clear all</Button>
  </Inline>
</template>
