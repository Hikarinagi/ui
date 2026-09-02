<script setup lang="ts">
  import { Prose } from '@hina-ui/vue'
</script>

<template>
  <Prose class="max-w-lg">
    <p>正文中的引用不需要单独引入组件。</p>
    <blockquote>写在文章里的引用块，会自动获得同样的样式。</blockquote>
    <p>它与组件的呈现完全一致。</p>
  </Prose>
</template>
