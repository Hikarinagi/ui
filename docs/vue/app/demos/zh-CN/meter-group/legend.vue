<script setup lang="ts">
  import { MeterGroup, type MeterItem } from '@hina-ui/vue'

  const items: MeterItem[] = [
    { label: '文档', value: 42 },
    { label: '图片', value: 27 },
    { label: '视频', value: 13 },
  ]
</script>

<template>
  <MeterGroup label="存储空间" :items="items" :legend="false" class="w-96" />
</template>
