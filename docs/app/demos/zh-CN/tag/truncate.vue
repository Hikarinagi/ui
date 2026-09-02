<script setup lang="ts">
  import { Tag, Text } from '@hina-ui/vue'
</script>

<template>
  <Tag class="max-w-40" tone="accent">
    <Text as="span" truncate>很长很长的标签名称会在容器边界处截断</Text>
  </Tag>
</template>
