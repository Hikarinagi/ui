<script setup lang="ts">
  import { MeterGroup, type MeterItem } from '@hina-ui/vue'

  const items: MeterItem[] = [
    { label: '文档', value: 38 },
    { label: '图片', value: 24 },
    { label: '视频', value: 46 },
  ]

  const format = (value: number) => `${value} GB`
</script>

<template>
  <MeterGroup label="存储空间" :items="items" :max="256" :format="format" class="w-96" />
</template>
