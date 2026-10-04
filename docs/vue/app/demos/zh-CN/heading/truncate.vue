<script setup lang="ts">
  import { Heading } from '@hina-ui/vue'
</script>

<template>
  <Heading :level="3" truncate class="max-w-xs">
    很长很长的章节标题会在容器边界处截断并显示省略号
  </Heading>
</template>
