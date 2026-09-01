<script setup lang="ts">
  import { Button, Inline, toast } from '@hikarinagi/ui'
</script>

<template>
  <Inline align="center" class="gap-3">
    <Button variant="outline" tone="neutral" @click="toast('一秒后消失', { duration: 1000 })">
      一秒
    </Button>
    <Button
      variant="outline"
      tone="neutral"
      @click="toast.info('需要手动关闭', { id: 'sticky', duration: 0 })"
    >
      不自动关闭
    </Button>
    <Button variant="soft" tone="neutral" @click="toast.dismiss('sticky')">关掉上一条</Button>
  </Inline>
</template>
