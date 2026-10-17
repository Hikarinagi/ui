<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Card, Drawer, OverlayBranch, Text } from '@hina-ui/vue'

  const open = ref(false)
  const count = ref(0)
</script>

<template>
  <Drawer v-model:open="open" title="阅读设置">
    <Button variant="outline" tone="neutral">打开抽屉</Button>
    <template #content>
      <Text tone="muted">左下角的卡片在抽屉外面。点它的按钮，抽屉保持打开。</Text>
    </template>
  </Drawer>
  <Teleport to="body">
    <OverlayBranch v-if="open" class="fixed start-4 bottom-4 z-[calc(var(--hn-z-overlay)+1)] w-56">
      <Card class="flex flex-col gap-2 p-3 shadow-lg">
        <Text size="sm" tone="muted">外部图层</Text>
        <Button size="sm" @click="count++">已点击 {{ count }} 次</Button>
      </Card>
    </OverlayBranch>
  </Teleport>
</template>
