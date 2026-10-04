<script setup lang="ts">
  import { Inline, Tag } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center">
    <Tag tone="neutral">草稿</Tag>
    <Tag tone="accent">推荐</Tag>
    <Tag tone="success">已通过</Tag>
    <Tag tone="warning">待复核</Tag>
    <Tag tone="danger">已驳回</Tag>
    <Tag tone="info">全年龄</Tag>
  </Inline>
</template>
