<script setup lang="ts">
  import { Copy, Download, Heart, Search } from '@lucide/vue'
  import { IconButton, Inline } from '@hikarinagi/ui'
</script>

<template>
  <Inline>
    <IconButton label="Tooltip above" variant="outline">
      <Search />
    </IconButton>
    <IconButton label="Tooltip on the right" side="right" variant="outline">
      <Copy />
    </IconButton>
    <IconButton label="Tooltip below" side="bottom" variant="outline">
      <Download />
    </IconButton>
    <IconButton label="No tooltip" :tooltip="false" variant="outline">
      <Heart />
    </IconButton>
  </Inline>
</template>
