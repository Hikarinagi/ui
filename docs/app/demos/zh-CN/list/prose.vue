<script setup lang="ts">
  import { Prose } from '@hina-ui/vue'
</script>

<template>
  <Prose class="max-w-md">
    <p>正文中的列表不需要单独引入组件。</p>
    <ul>
      <li>无序列表</li>
      <li>与组件的呈现一致</li>
    </ul>
    <ol>
      <li>有序列表</li>
      <li>同样如此</li>
    </ol>
  </Prose>
</template>
