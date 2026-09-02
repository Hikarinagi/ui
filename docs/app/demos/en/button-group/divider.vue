<script setup lang="ts">
  import { Button, ButtonGroup, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack align="center">
    <ButtonGroup label="Without divider">
      <Button variant="soft" tone="neutral">Copy</Button>
      <Button variant="soft" tone="neutral">Cut</Button>
      <Button variant="soft" tone="neutral">Paste</Button>
    </ButtonGroup>

    <ButtonGroup label="With divider" divider>
      <Button variant="soft" tone="neutral">Copy</Button>
      <Button variant="soft" tone="neutral">Cut</Button>
      <Button variant="soft" tone="neutral">Paste</Button>
    </ButtonGroup>
  </Stack>
</template>
