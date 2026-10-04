<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Sheet, Text } from '@hina-ui/vue'

  const open = ref(false)
</script>

<template>
  <Inline gap="sm">
    <Button variant="outline" tone="neutral" @click="open = true">从外部打开</Button>
    <Sheet v-model:open="open" title="已收藏" description="这篇文章已加入你的收藏。">
      <template #content>
        <Text>没有触发器的面板，由外部的按钮打开。</Text>
      </template>
      <template #footer="{ close }">
        <Button @click="close">知道了</Button>
      </template>
    </Sheet>
  </Inline>
</template>
