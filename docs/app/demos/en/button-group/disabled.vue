<script setup lang="ts">
  import { Button, ButtonGroup, Stack } from '@hikarinagi/ui'
</script>

<template>
  <Stack align="center">
    <ButtonGroup label="Whole group disabled">
      <Button variant="outline" tone="neutral" disabled>Bold</Button>
      <Button variant="outline" tone="neutral" disabled>Italic</Button>
      <Button variant="outline" tone="neutral" disabled>Underline</Button>
    </ButtonGroup>

    <ButtonGroup label="One disabled">
      <Button variant="outline" tone="neutral" disabled>Previous</Button>
      <Button variant="outline" tone="neutral">Refresh</Button>
      <Button variant="outline" tone="neutral">Next</Button>
    </ButtonGroup>
  </Stack>
</template>
