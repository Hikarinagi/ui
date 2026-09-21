<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { Anchor, Heading, Inline, ScrollArea, Section, Stack, Switch, Text } from '@hina-ui/vue'

  const topics = ['背景与目标', '设计过程', '实现细节', '使用体验', '总结与展望']
  const items = Array.from({ length: 51 }, (_, index) => ({
    id: `long-toc-${index + 1}`,
    label: `第 ${index + 1} 节 · ${topics[index % topics.length]}`,
  }))
  const autoScroll = ref(true)
  const current = ref<string>()
  const currentLabel = computed(() => items.find(item => item.id === current.value)?.label)
</script>

<template>
  <Stack class="w-full max-w-2xl">
    <Inline justify="between">
      <Switch v-model="autoScroll">目录自动跟随</Switch>
      <Text size="sm" tone="muted">共 51 节</Text>
    </Inline>
    <Inline align="start" gap="md" :wrap="false">
      <ScrollArea
        class="border-line h-80 min-w-0 flex-1 rounded-lg border"
        focusable
        label="文章正文"
      >
        <Section v-for="item in items" :id="item.id" :key="item.id" class="min-h-56 p-4">
          <Heading :level="3" size="sm">{{ item.label }}</Heading>
          <Text size="sm" tone="muted">
            滚动正文阅读后续小节，目录会让当前项保持可见。也可以独立滚动目录，查找其他章节。
          </Text>
        </Section>
      </ScrollArea>
      <ScrollArea
        class="h-80 w-2/5 max-w-48 shrink-0"
        :shadow="false"
        focusable
        label="文章目录滚动区域"
      >
        <Anchor
          :items="items"
          :auto-scroll="autoScroll"
          label="长篇文章目录"
          @change="current = $event"
        />
      </ScrollArea>
    </Inline>
    <Text size="sm" tone="muted">当前：{{ currentLabel ?? '尚未进入正文' }}</Text>
  </Stack>
</template>
