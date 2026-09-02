<script setup lang="ts">
  import { Prose } from '@hina-ui/vue'
</script>

<template>
  <Prose class="max-w-lg">
    <p>
      正文中的
      <code>code</code>
      标签不需要单独引入组件。
    </p>
    <p>它与组件的呈现完全一致。</p>
  </Prose>
</template>
