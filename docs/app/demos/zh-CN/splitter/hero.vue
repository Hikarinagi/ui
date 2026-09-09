<script setup lang="ts">
  import { Card, Splitter, SplitterHandle, SplitterPanel, Stack, Text } from '@hina-ui/vue'

  const chapters = ['第 I 章', '第 II 章', '第 III 章']
</script>

<template>
  <Card :padded="false" class="w-full max-w-2xl overflow-hidden">
    <Splitter class="h-64">
      <SplitterPanel :default-size="32" :min-size="20">
        <Stack gap="xs" class="p-4">
          <Text size="sm" tone="faint">目录</Text>
          <Text v-for="chapter in chapters" :key="chapter" size="sm">{{ chapter }}</Text>
        </Stack>
      </SplitterPanel>
      <SplitterHandle />
      <SplitterPanel :default-size="68">
        <Stack gap="sm" class="p-4">
          <Text size="sm" tone="faint">正文</Text>
          <Text size="sm">拖动中间的分隔线可以调整两侧的宽度。</Text>
        </Stack>
      </SplitterPanel>
    </Splitter>
  </Card>
</template>
