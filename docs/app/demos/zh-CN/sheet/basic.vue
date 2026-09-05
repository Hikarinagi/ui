<script setup lang="ts">
  import { Button, Sheet, Text } from '@hina-ui/vue'
</script>

<template>
  <Sheet title="筛选" description="只影响当前列表。">
    <Button variant="outline" tone="neutral">打开筛选</Button>
    <template #content>
      <Text>把筛选条件放在这里。按住顶部的把手向下拖动可以关闭。</Text>
    </template>
    <template #footer="{ close }">
      <Button variant="soft" tone="neutral" @click="close">重置</Button>
      <Button @click="close">应用</Button>
    </template>
  </Sheet>
</template>
