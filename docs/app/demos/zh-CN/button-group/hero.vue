<script setup lang="ts">
  import { AlignCenter, AlignLeft, AlignRight } from '@lucide/vue'
  import { ButtonGroup, IconButton } from '@hikarinagi/ui'
</script>

<template>
  <ButtonGroup label="对齐方式">
    <IconButton label="左对齐" variant="outline">
      <AlignLeft />
    </IconButton>
    <IconButton label="居中" variant="outline">
      <AlignCenter />
    </IconButton>
    <IconButton label="右对齐" variant="outline">
      <AlignRight />
    </IconButton>
  </ButtonGroup>
</template>
