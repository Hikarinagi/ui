<script setup lang="ts">
  import { Send } from '@lucide/vue'
  import { Button, Inline } from '@hikarinagi/ui'
</script>

<template>
  <Inline>
    <Button variant="ghost" tone="neutral">Cancel</Button>
    <Button variant="outline" tone="neutral">Save draft</Button>
    <Button>
      <template #icon>
        <Send />
      </template>
      Publish
    </Button>
  </Inline>
</template>
