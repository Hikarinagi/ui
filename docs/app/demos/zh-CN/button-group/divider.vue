<script setup lang="ts">
  import { Button, ButtonGroup, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack align="center">
    <ButtonGroup label="不带分隔线">
      <Button variant="soft" tone="neutral">复制</Button>
      <Button variant="soft" tone="neutral">剪切</Button>
      <Button variant="soft" tone="neutral">粘贴</Button>
    </ButtonGroup>

    <ButtonGroup label="带分隔线" divider>
      <Button variant="soft" tone="neutral">复制</Button>
      <Button variant="soft" tone="neutral">剪切</Button>
      <Button variant="soft" tone="neutral">粘贴</Button>
    </ButtonGroup>
  </Stack>
</template>
