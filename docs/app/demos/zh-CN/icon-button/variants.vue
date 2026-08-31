<script setup lang="ts">
  import { Settings, Trash2 } from '@lucide/vue'
  import { IconButton, Inline } from '@hikarinagi/ui'
</script>

<template>
  <Inline>
    <IconButton label="设置" variant="solid" tone="accent">
      <Settings />
    </IconButton>
    <IconButton label="设置" variant="soft">
      <Settings />
    </IconButton>
    <IconButton label="设置" variant="outline">
      <Settings />
    </IconButton>
    <IconButton label="设置">
      <Settings />
    </IconButton>
    <IconButton label="删除" variant="soft" tone="danger">
      <Trash2 />
    </IconButton>
  </Inline>
</template>
