<script setup lang="ts">
  import { Button, ButtonGroup, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack align="center">
    <ButtonGroup label="整组不可用">
      <Button variant="outline" tone="neutral" disabled>加粗</Button>
      <Button variant="outline" tone="neutral" disabled>斜体</Button>
      <Button variant="outline" tone="neutral" disabled>下划线</Button>
    </ButtonGroup>

    <ButtonGroup label="单个不可用">
      <Button variant="outline" tone="neutral" disabled>上一页</Button>
      <Button variant="outline" tone="neutral">刷新</Button>
      <Button variant="outline" tone="neutral">下一页</Button>
    </ButtonGroup>
  </Stack>
</template>
