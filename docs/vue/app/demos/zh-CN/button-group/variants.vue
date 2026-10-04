<script setup lang="ts">
  import { Button, ButtonGroup, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack align="center">
    <ButtonGroup label="填充">
      <Button variant="solid" tone="accent">上一步</Button>
      <Button variant="solid" tone="accent">保存</Button>
      <Button variant="solid" tone="accent">下一步</Button>
    </ButtonGroup>

    <ButtonGroup label="浅色">
      <Button variant="soft" tone="accent">上一步</Button>
      <Button variant="soft" tone="accent">保存</Button>
      <Button variant="soft" tone="accent">下一步</Button>
    </ButtonGroup>

    <ButtonGroup label="描边">
      <Button variant="outline" tone="neutral">上一步</Button>
      <Button variant="outline" tone="neutral">保存</Button>
      <Button variant="outline" tone="neutral">下一步</Button>
    </ButtonGroup>
  </Stack>
</template>
