<script setup lang="ts">
  import { Banner, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-full">
    <Banner tone="neutral">本站已启用新的评论系统。</Banner>
    <Banner tone="accent">Hina UI 1.2 已发布。</Banner>
    <Banner tone="info">当前浏览的是历史版本的文档。</Banner>
    <Banner tone="success">你的邮箱已完成验证。</Banner>
    <Banner tone="warning">本站将于今晚 02:00 停机维护。</Banner>
    <Banner tone="danger">支付服务暂时不可用，我们正在处理。</Banner>
    <Banner tone="accent" :icon="false">Hina UI 1.2 已发布。</Banner>
  </Stack>
</template>
