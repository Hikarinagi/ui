<script setup lang="ts">
  import { Button, toast } from '@hikarinagi/ui'
</script>

<template>
  <Button
    variant="outline"
    tone="neutral"
    @click="
      toast.success('Import finished', {
        description: '128 books imported, 3 skipped for an unsupported format.',
      })
    "
  >
    With a description
  </Button>
</template>
