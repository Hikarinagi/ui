<script setup lang="ts">
  import { Button, ButtonGroup, Stack } from '@hikarinagi/ui'
</script>

<template>
  <Stack align="center">
    <ButtonGroup label="Solid">
      <Button variant="solid" tone="accent">Back</Button>
      <Button variant="solid" tone="accent">Save</Button>
      <Button variant="solid" tone="accent">Next</Button>
    </ButtonGroup>

    <ButtonGroup label="Soft">
      <Button variant="soft" tone="accent">Back</Button>
      <Button variant="soft" tone="accent">Save</Button>
      <Button variant="soft" tone="accent">Next</Button>
    </ButtonGroup>

    <ButtonGroup label="Outline">
      <Button variant="outline" tone="neutral">Back</Button>
      <Button variant="outline" tone="neutral">Save</Button>
      <Button variant="outline" tone="neutral">Next</Button>
    </ButtonGroup>
  </Stack>
</template>
