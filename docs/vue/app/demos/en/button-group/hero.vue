<script setup lang="ts">
  import { AlignCenter, AlignLeft, AlignRight } from '@lucide/vue'
  import { ButtonGroup, IconButton } from '@hina-ui/vue'
</script>

<template>
  <ButtonGroup label="Alignment">
    <IconButton label="Align left" variant="outline">
      <AlignLeft />
    </IconButton>
    <IconButton label="Align center" variant="outline">
      <AlignCenter />
    </IconButton>
    <IconButton label="Align right" variant="outline">
      <AlignRight />
    </IconButton>
  </ButtonGroup>
</template>
