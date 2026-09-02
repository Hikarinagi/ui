<script setup lang="ts">
  import { Alert, Stack } from '@hikarinagi/ui'
</script>

<template>
  <Stack class="w-full max-w-xl">
    <Alert>已保存到草稿箱。</Alert>
    <Alert tone="accent">新版本已经可用，刷新页面即可体验。</Alert>
    <Alert tone="info">本页内容来自用户投稿，尚未经过审核。</Alert>
    <Alert tone="success">文章已发布。</Alert>
    <Alert tone="warning">登录状态即将过期，请尽快保存。</Alert>
    <Alert tone="danger">发布失败，请稍后重试。</Alert>
    <Alert tone="success" :icon="false">文章已发布。</Alert>
  </Stack>
</template>
