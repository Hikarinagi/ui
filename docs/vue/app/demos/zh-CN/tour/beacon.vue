<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Tour, type TourStep } from '@hina-ui/vue'

  const open = ref(false)

  const steps: TourStep[] = [
    { target: '#tour-beacon-export', title: '导出', description: '新增了导出为 PDF。' },
    {
      target: '#tour-beacon-history',
      title: '历史版本',
      description: '每次保存都会留下一个版本。',
    },
  ]
</script>

<template>
  <Inline gap="lg" align="center" wrap>
    <Button id="tour-beacon-export" variant="outline" tone="neutral">导出</Button>
    <Button id="tour-beacon-history" variant="outline" tone="neutral">历史版本</Button>
    <Button variant="ghost" tone="neutral" @click="open = !open">
      {{ open ? '隐藏提示' : '显示新功能' }}
    </Button>
  </Inline>
  <Tour v-model:open="open" :steps="steps" beacon />
</template>
