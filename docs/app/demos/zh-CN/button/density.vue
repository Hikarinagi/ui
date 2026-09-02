<script setup lang="ts">
  import { Button, Inline, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack>
    <Inline>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </Inline>
    <Inline data-density="compact">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </Inline>
  </Stack>
</template>
