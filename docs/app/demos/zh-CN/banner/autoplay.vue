<script setup lang="ts">
  import { Banner } from '@hina-ui/vue'

  const notices = [
    { text: '新增书评 86 条，活跃读者 1,204 人。' },
    { text: '本周最受欢迎的作品是《星见书音》。' },
    { text: '书架支持按标签筛选了。' },
  ]
</script>

<template>
  <Banner :items="notices" :autoplay="4000" tone="info">
    <template #item="{ item }">{{ item.text }}</template>
  </Banner>
</template>
