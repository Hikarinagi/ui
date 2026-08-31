<script setup lang="ts">
  import { Copy, Scissors, Trash2 } from '@lucide/vue'
  import { Button, ButtonGroup } from '@hikarinagi/ui'
</script>

<template>
  <ButtonGroup label="文件操作" orientation="vertical" divider>
    <Button variant="soft" tone="neutral">
      <template #icon>
        <Copy />
      </template>
      复制
    </Button>
    <Button variant="soft" tone="neutral">
      <template #icon>
        <Scissors />
      </template>
      剪切
    </Button>
    <Button variant="soft" tone="neutral">
      <template #icon>
        <Trash2 />
      </template>
      删除
    </Button>
  </ButtonGroup>
</template>
