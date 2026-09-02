<script setup lang="ts">
  import { Button, Inline, toast } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center" class="gap-3">
    <Button variant="outline" tone="neutral" @click="toast.success('已加入书架')">success</Button>
    <Button variant="outline" tone="neutral" @click="toast.danger('网络连接中断')">danger</Button>
    <Button variant="outline" tone="neutral" @click="toast.warning('还有未保存的改动')">
      warning
    </Button>
    <Button variant="outline" tone="neutral" @click="toast.info('新版本已经可用')">info</Button>
    <Button variant="outline" tone="neutral" @click="toast.loading('正在同步')">loading</Button>
  </Inline>
</template>
