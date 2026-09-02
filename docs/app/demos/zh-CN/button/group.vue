<script setup lang="ts">
  import { AlignCenter, AlignLeft, AlignRight } from '@lucide/vue'
  import { Button, ButtonGroup, IconButton, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack align="center">
    <ButtonGroup label="对齐方式">
      <IconButton label="左对齐" variant="outline" tone="neutral">
        <AlignLeft />
      </IconButton>
      <IconButton label="居中" variant="outline" tone="neutral">
        <AlignCenter />
      </IconButton>
      <IconButton label="右对齐" variant="outline" tone="neutral">
        <AlignRight />
      </IconButton>
    </ButtonGroup>

    <ButtonGroup label="视图" divider>
      <Button variant="soft" tone="neutral">列表</Button>
      <Button variant="soft" tone="neutral">网格</Button>
      <Button variant="soft" tone="neutral">时间线</Button>
    </ButtonGroup>
  </Stack>
</template>
