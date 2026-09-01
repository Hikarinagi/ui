<script setup lang="ts">
  import { Button, Inline, toast } from '@hikarinagi/ui'
</script>

<template>
  <Inline align="center" class="gap-3">
    <Button variant="outline" tone="neutral" @click="toast('Gone in a second', { duration: 1000 })">
      One second
    </Button>
    <Button
      variant="outline"
      tone="neutral"
      @click="toast.info('Stays until dismissed', { id: 'sticky', duration: 0 })"
    >
      No auto close
    </Button>
    <Button variant="soft" tone="neutral" @click="toast.dismiss('sticky')">Dismiss that one</Button>
  </Inline>
</template>
