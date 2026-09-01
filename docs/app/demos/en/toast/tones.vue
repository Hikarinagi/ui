<script setup lang="ts">
  import { Button, Inline, toast } from '@hikarinagi/ui'
</script>

<template>
  <Inline align="center" class="gap-3">
    <Button variant="outline" tone="neutral" @click="toast.success('Added to your shelf')">
      success
    </Button>
    <Button variant="outline" tone="neutral" @click="toast.danger('The connection dropped')">
      danger
    </Button>
    <Button variant="outline" tone="neutral" @click="toast.warning('You have unsaved changes')">
      warning
    </Button>
    <Button variant="outline" tone="neutral" @click="toast.info('A new version is available')">
      info
    </Button>
    <Button variant="outline" tone="neutral" @click="toast.loading('Syncing')">loading</Button>
  </Inline>
</template>
