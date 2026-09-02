<script setup lang="ts">
  import { Prose } from '@hina-ui/vue'
</script>

<template>
  <Prose class="max-w-lg">
    <h2>正文中的标题</h2>
    <p>渲染 Markdown 时不需要替换标签。</p>
    <h3>下一层标题</h3>
    <p>层级与字号的对应关系与组件一致。</p>
  </Prose>
</template>
