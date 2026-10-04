<script setup lang="ts">
  import { Copy, Download, Heart, Search } from '@lucide/vue'
  import { IconButton, Inline } from '@hina-ui/vue'
</script>

<template>
  <Inline>
    <IconButton label="提示在上方" variant="outline">
      <Search />
    </IconButton>
    <IconButton label="提示在右侧" side="right" variant="outline">
      <Copy />
    </IconButton>
    <IconButton label="提示在下方" side="bottom" variant="outline">
      <Download />
    </IconButton>
    <IconButton label="不显示提示" :tooltip="false" variant="outline">
      <Heart />
    </IconButton>
  </Inline>
</template>
