<script setup lang="ts">
  import { Button, toast } from '@hina-ui/vue'

  function sync() {
    toast.loading('Syncing', { id: 'sync' })
    setTimeout(() => toast.loading('Synced 12 of 30', { id: 'sync' }), 1000)
    setTimeout(() => toast.success('Sync finished', { id: 'sync' }), 2000)
  }
</script>

<template>
  <Button variant="outline" tone="neutral" @click="sync">Start syncing</Button>
</template>
