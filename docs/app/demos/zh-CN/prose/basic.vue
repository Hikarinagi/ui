<script setup lang="ts">
  import { Prose } from '@hina-ui/vue'
</script>

<template>
  <Prose class="max-w-lg" v-html="'<h3>标题</h3><p>一段来自接口的 HTML。</p>'" />
</template>
