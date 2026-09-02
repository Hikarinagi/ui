<script setup lang="ts">
  import { CloseButton, Inline } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center">
    <CloseButton tooltip />
    <CloseButton label="关闭预览" tooltip side="right" />
  </Inline>
</template>
