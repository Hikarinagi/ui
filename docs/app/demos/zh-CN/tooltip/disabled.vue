<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Text, Tooltip } from '@hina-ui/vue'

  const off = ref(true)
</script>

<template>
  <Inline align="center">
    <Tooltip content="侧栏收起时才需要这句话" :disabled="off">
      <Button variant="outline" tone="neutral">悬停试试</Button>
    </Tooltip>
    <Button size="sm" variant="soft" tone="neutral" @click="off = !off">
      {{ off ? '启用提示' : '禁用提示' }}
    </Button>
    <Text tone="muted" size="sm">当前：{{ off ? '已禁用' : '已启用' }}</Text>
  </Inline>
</template>
