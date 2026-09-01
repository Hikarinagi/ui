<script setup lang="ts">
  import { Button, toast } from '@hikarinagi/ui'
</script>

<template>
  <Button
    variant="outline"
    tone="neutral"
    @click="
      toast.success('导入完成', { description: '共导入 128 本书，其中 3 本因格式不符被跳过。' })
    "
  >
    带说明的提示
  </Button>
</template>
