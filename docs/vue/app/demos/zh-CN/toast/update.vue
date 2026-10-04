<script setup lang="ts">
  import { Button, toast } from '@hina-ui/vue'

  function sync() {
    toast.loading('正在同步', { id: 'sync' })
    setTimeout(() => toast.loading('已同步 12 / 30', { id: 'sync' }), 1000)
    setTimeout(() => toast.success('同步完成', { id: 'sync' }), 2000)
  }
</script>

<template>
  <Button variant="outline" tone="neutral" @click="sync">开始同步</Button>
</template>
