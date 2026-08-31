<script setup lang="ts">
  import { ChevronDown } from '@lucide/vue'
  import { Button, ButtonGroup, IconButton } from '@hikarinagi/ui'
</script>

<template>
  <ButtonGroup label="Publish">
    <Button>Publish now</Button>
    <IconButton label="More publish options" variant="solid" tone="accent">
      <ChevronDown />
    </IconButton>
  </ButtonGroup>
</template>
