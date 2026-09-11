<script setup lang="ts">
  import { Button, Dialog, Text } from '@hina-ui/vue'
</script>

<template>
  <Dialog title="无关闭按钮" :closable="false">
    <Button variant="outline" tone="neutral">无关闭按钮</Button>
    <template #content>
      <Text>按 Esc、点击遮罩或底部按钮均可关闭。</Text>
    </template>
    <template #footer="{ close }">
      <Button @click="close">关闭</Button>
    </template>
  </Dialog>
</template>
