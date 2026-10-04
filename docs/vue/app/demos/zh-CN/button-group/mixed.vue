<script setup lang="ts">
  import { ChevronDown } from '@lucide/vue'
  import { Button, ButtonGroup, IconButton } from '@hina-ui/vue'
</script>

<template>
  <ButtonGroup label="发布">
    <Button>立即发布</Button>
    <IconButton label="更多发布选项" variant="solid" tone="accent">
      <ChevronDown />
    </IconButton>
  </ButtonGroup>
</template>
