<script setup lang="ts">
  import { Prose } from '@hina-ui/vue'
</script>

<template>
  <Prose as="article" class="max-w-lg">
    <h3>渲染为 article</h3>
    <p>容器标签由 as 决定，正文样式不变。</p>
  </Prose>
</template>
