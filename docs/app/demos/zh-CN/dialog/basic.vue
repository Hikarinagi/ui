<script setup lang="ts">
  import { Button, Dialog, Text } from '@hikarinagi/ui'
</script>

<template>
  <Dialog title="发布这篇文章" description="发布之后所有人都能看到它。">
    <Button variant="outline" tone="neutral">发布</Button>
    <template #content>
      <Text>文章会出现在你的主页与订阅者的时间线上。</Text>
    </template>
    <template #footer="{ close }">
      <Button variant="soft" tone="neutral" @click="close">再想想</Button>
      <Button @click="close">发布</Button>
    </template>
  </Dialog>
</template>
