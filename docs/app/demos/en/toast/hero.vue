<script setup lang="ts">
  import { Button, Inline, toast } from '@hikarinagi/ui'
</script>

<template>
  <Inline align="center" class="gap-3">
    <Button variant="outline" tone="neutral" @click="toast('Draft saved')">Default</Button>
    <Button variant="outline" tone="neutral" @click="toast.success('Article published')">
      Success
    </Button>
    <Button
      variant="outline"
      tone="neutral"
      @click="toast.danger('Upload failed', { description: 'The file is larger than 20 MB.' })"
    >
      Failure
    </Button>
  </Inline>
</template>
