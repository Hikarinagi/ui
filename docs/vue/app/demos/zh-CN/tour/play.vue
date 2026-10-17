<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Drawer, Inline, List, ListItem, Text, Tour, type TourStep } from '@hina-ui/vue'

  const open = ref(false)
  const contents = ref(false)
  const page = ref(12)

  const steps: TourStep[] = [
    {
      target: '#tour-play-contents',
      title: '目录',
      description: '点这里打开目录。',
      play: async ({ pointer }) => {
        await pointer.move('#tour-play-contents')
        await pointer.tap()
      },
    },
    {
      target: '#tour-play-chapter',
      title: '跳到章节',
      description: '目录里点章节名就能跳过去。',
      wait: 2000,
      play: async ({ pointer, defer, waitFor }) => {
        contents.value = true
        defer(() => (contents.value = false))
        await waitFor('#tour-play-chapter')
        await pointer.move('#tour-play-chapter')
        await pointer.tap()
      },
    },
    {
      target: '#tour-play-page',
      title: '翻页',
      description: '按 ← 和 → 翻页。',
      play: async ({ pointer, sleep }) => {
        await pointer.key('→')
        page.value += 1
        await sleep(400)
        await pointer.key('←')
        page.value -= 1
      },
    },
  ]
</script>

<template>
  <Inline gap="sm" align="center" wrap>
    <Button id="tour-play-contents" variant="outline" tone="neutral" @click="contents = true">
      目录
    </Button>
    <Text id="tour-play-page" tone="muted" class="tabular-nums">第 {{ page }} 页</Text>
    <Button variant="ghost" tone="neutral" @click="open = true">看看怎么用</Button>
  </Inline>
  <Drawer v-model:open="contents" title="目录">
    <template #content>
      <List>
        <ListItem>第一章 春分</ListItem>
        <ListItem>第二章 远雷</ListItem>
        <ListItem id="tour-play-chapter">第三章 雨夜</ListItem>
      </List>
    </template>
  </Drawer>
  <Tour v-model:open="open" :steps="steps" mask="dim" block-page />
</template>
