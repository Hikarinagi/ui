<script setup lang="ts">
  import { Chip, Inline } from '@hina-ui/vue'
</script>

<template>
  <Inline>
    <Chip selectable disabled>未选中</Chip>
    <Chip selectable selected disabled>已选中</Chip>
    <Chip removable disabled>不可移除</Chip>
  </Inline>
</template>
