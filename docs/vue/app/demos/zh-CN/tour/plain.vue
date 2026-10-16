<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Tour, type TourStep } from '@hina-ui/vue'

  const open = ref(false)

  const steps: TourStep[] = [
    { target: '#tour-plain-filter', title: '筛选', description: '页面在引导期间仍可操作。' },
    { target: '#tour-plain-sort', title: '排序', description: '点击切换升序与降序。' },
  ]
</script>

<template>
  <Inline gap="sm" align="center" wrap>
    <Button id="tour-plain-filter" variant="outline" tone="neutral">筛选</Button>
    <Button id="tour-plain-sort" variant="outline" tone="neutral">排序</Button>
    <Button variant="ghost" tone="neutral" @click="open = true">开始引导</Button>
  </Inline>
  <Tour v-model:open="open" :steps="steps" :mask="false" />
</template>
