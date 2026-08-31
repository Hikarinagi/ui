<script setup lang="ts">
  import { Button, ButtonGroup, Stack } from '@hikarinagi/ui'
</script>

<template>
  <Stack align="center">
    <ButtonGroup label="Small">
      <Button size="sm" variant="outline" tone="neutral">Day</Button>
      <Button size="sm" variant="outline" tone="neutral">Week</Button>
      <Button size="sm" variant="outline" tone="neutral">Month</Button>
    </ButtonGroup>

    <ButtonGroup label="Medium">
      <Button variant="outline" tone="neutral">Day</Button>
      <Button variant="outline" tone="neutral">Week</Button>
      <Button variant="outline" tone="neutral">Month</Button>
    </ButtonGroup>

    <ButtonGroup label="Large">
      <Button size="lg" variant="outline" tone="neutral">Day</Button>
      <Button size="lg" variant="outline" tone="neutral">Week</Button>
      <Button size="lg" variant="outline" tone="neutral">Month</Button>
    </ButtonGroup>
  </Stack>
</template>
