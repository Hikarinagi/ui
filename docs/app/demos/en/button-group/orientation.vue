<script setup lang="ts">
  import { Copy, Scissors, Trash2 } from '@lucide/vue'
  import { Button, ButtonGroup } from '@hina-ui/vue'
</script>

<template>
  <ButtonGroup label="File actions" orientation="vertical" divider>
    <Button variant="soft" tone="neutral">
      <template #icon>
        <Copy />
      </template>
      Copy
    </Button>
    <Button variant="soft" tone="neutral">
      <template #icon>
        <Scissors />
      </template>
      Cut
    </Button>
    <Button variant="soft" tone="neutral">
      <template #icon>
        <Trash2 />
      </template>
      Delete
    </Button>
  </ButtonGroup>
</template>
