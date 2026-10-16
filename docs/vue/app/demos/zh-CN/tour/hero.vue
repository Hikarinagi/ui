<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Input, Tour, type TourStep } from '@hina-ui/vue'

  const open = ref(false)
  const step = ref(1)

  const steps: TourStep[] = [
    { title: '欢迎使用', description: '花半分钟认识一下工作台的几个入口。' },
    { target: '#tour-hero-create', title: '新建项目', description: '从这里创建第一个项目。' },
    { target: '#tour-hero-search', title: '搜索', description: '按名称或标签查找项目。' },
    {
      target: '#tour-hero-share',
      title: '邀请成员',
      description: '把链接发给同事，一起编辑。',
      side: 'left',
    },
  ]

  function start() {
    step.value = 1
    open.value = true
  }
</script>

<template>
  <Inline gap="sm" align="center" wrap>
    <Button id="tour-hero-create">新建项目</Button>
    <Input id="tour-hero-search" placeholder="搜索项目" class="w-48" />
    <Button id="tour-hero-share" variant="outline" tone="neutral">邀请</Button>
    <Button variant="ghost" tone="neutral" @click="start">开始引导</Button>
  </Inline>
  <Tour v-model:open="open" v-model:step="step" :steps="steps" />
</template>
