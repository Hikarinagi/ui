<script setup lang="ts">
  import { Settings, Trash2 } from '@lucide/vue'
  import { IconButton, Inline } from '@hina-ui/vue'
</script>

<template>
  <Inline>
    <IconButton label="Settings" variant="solid" tone="accent">
      <Settings />
    </IconButton>
    <IconButton label="Settings" variant="soft">
      <Settings />
    </IconButton>
    <IconButton label="Settings" variant="outline">
      <Settings />
    </IconButton>
    <IconButton label="Settings">
      <Settings />
    </IconButton>
    <IconButton label="Delete" variant="soft" tone="danger">
      <Trash2 />
    </IconButton>
  </Inline>
</template>
