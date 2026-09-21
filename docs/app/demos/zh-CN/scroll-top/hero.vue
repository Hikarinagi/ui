<script setup lang="ts">
  import { ref } from 'vue'
  import { Card, Heading, ScrollArea, ScrollTop, Stack, Text } from '@hina-ui/vue'

  const area = ref<InstanceType<typeof ScrollArea>>()
  const sections = [
    {
      title: '明确操作的主次',
      body: '一个区域通常只需要一个主要操作。次要操作放在内容附近，低频操作可以收到菜单里，让常用路径保持清晰。',
    },
    {
      title: '给出可见的反馈',
      body: '保存、上传和同步都需要反馈。等待时保留内容，完成后给出结果；失败时保留用户输入，让用户能够直接重试。',
    },
    {
      title: '让长内容易于浏览',
      body: '用标题建立结构，用间距区分段落。列表很长时保留稳定的滚动位置，提供返回开头的入口，而不是在内容更新时强制滚动。',
    },
    {
      title: '照顾不同输入方式',
      body: '鼠标、触摸和键盘都应当能完成操作。焦点清晰可见，图标按钮有明确名称，浮层关闭后将焦点返回合理的位置。',
    },
    {
      title: '减少不必要的动态效果',
      body: '动效用来解释状态和位置的变化。系统开启减少动态效果时，保留操作结果，让用户不必等待滚动或移动动画。',
    },
    {
      title: '最后检查真实场景',
      body: '换一组更长的文案，缩窄窗口，试用键盘，再检查深色模式。组件只有在这些场景里都能工作，才算完成。',
    },
  ]
</script>

<template>
  <Stack class="w-full max-w-lg" gap="sm">
    <Text size="sm" tone="muted">在面板内向下滚动，超过 120px 后显示回顶按钮。</Text>
    <Card :padded="false" class="relative overflow-hidden">
      <ScrollArea ref="area" class="h-72" :shadow="false" focusable label="交互设计笔记">
        <Stack gap="lg" class="p-5 pb-24">
          <Stack v-for="section in sections" :key="section.title" gap="sm">
            <Heading :level="3" size="base">{{ section.title }}</Heading>
            <Text size="sm" tone="muted">{{ section.body }}</Text>
          </Stack>
        </Stack>
      </ScrollArea>
      <ScrollTop :target="() => area?.viewport" :threshold="120" position="absolute" :offset="16" />
    </Card>
  </Stack>
</template>
