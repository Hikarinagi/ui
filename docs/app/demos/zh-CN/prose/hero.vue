<script setup lang="ts">
  import { Prose } from '@hina-ui/vue'
</script>

<template>
  <Prose class="max-w-xl">
    <h2>星之航路</h2>
    <p>
      这是一段来自后端的富文本。段落、标题、列表与引用都由容器统一接管，调用方不需要为每个标签指定样式。
    </p>
    <blockquote>书页翻动的声音，是图书馆唯一允许的喧哗。</blockquote>
    <ul>
      <li>第一卷 启航</li>
      <li>第二卷 远洋</li>
    </ul>
  </Prose>
</template>
