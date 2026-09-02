<script setup lang="ts">
  import { Button, ButtonGroup, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack align="center">
    <ButtonGroup label="小号">
      <Button size="sm" variant="outline" tone="neutral">日</Button>
      <Button size="sm" variant="outline" tone="neutral">周</Button>
      <Button size="sm" variant="outline" tone="neutral">月</Button>
    </ButtonGroup>

    <ButtonGroup label="中号">
      <Button variant="outline" tone="neutral">日</Button>
      <Button variant="outline" tone="neutral">周</Button>
      <Button variant="outline" tone="neutral">月</Button>
    </ButtonGroup>

    <ButtonGroup label="大号">
      <Button size="lg" variant="outline" tone="neutral">日</Button>
      <Button size="lg" variant="outline" tone="neutral">周</Button>
      <Button size="lg" variant="outline" tone="neutral">月</Button>
    </ButtonGroup>
  </Stack>
</template>
