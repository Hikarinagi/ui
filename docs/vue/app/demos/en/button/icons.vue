<script setup lang="ts">
  import { ArrowRight, Plus, Settings } from '@lucide/vue'
  import { Button, IconButton, Inline } from '@hina-ui/vue'
</script>

<template>
  <Inline>
    <Button>
      <template #icon>
        <Plus />
      </template>
      New
    </Button>
    <Button variant="outline" tone="neutral">
      Next
      <template #trailing>
        <ArrowRight />
      </template>
    </Button>
    <IconButton label="Settings" variant="outline">
      <Settings />
    </IconButton>
  </Inline>
</template>
