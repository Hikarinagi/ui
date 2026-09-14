<script setup lang="ts">
  import { Button, CloseButton, Sheet, Inline, ScrollArea, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Inline>
    <Sheet
      v-for="handle in [true, false]"
      :key="String(handle)"
      :handle="handle"
      title="自定义布局"
      description="标题与说明仍保留为无障碍内容。"
    >
      <Button variant="outline" tone="neutral">{{ handle ? '保留把手' : '无把手' }}</Button>
      <template #body="{ close }">
        <Stack gap="none" class="h-[min(32rem,70dvh)] min-h-0">
          <Inline
            justify="between"
            :wrap="false"
            class="border-line bg-inset shrink-0 gap-3 border-b p-4"
          >
            <Stack gap="xs" class="min-w-0">
              <Text weight="medium">自定义布局</Text>
              <Text size="sm" tone="muted">标题栏、滚动区域和底栏均由插槽提供。</Text>
            </Stack>
            <CloseButton @click="close" />
          </Inline>
          <ScrollArea class="min-h-0 flex-1">
            <Stack gap="none" class="divide-line divide-y px-4">
              <Text v-for="index in 30" :key="index" class="py-3">内容 {{ index }}</Text>
            </Stack>
          </ScrollArea>
          <Inline
            justify="between"
            :wrap="false"
            class="border-line shrink-0 gap-3 border-t p-4 pb-[max(var(--hn-panel-p),env(safe-area-inset-bottom))]"
          >
            <Text size="sm" tone="muted">底栏保持可见</Text>
            <Button size="sm" @click="close">完成</Button>
          </Inline>
        </Stack>
      </template>
    </Sheet>
  </Inline>
</template>
