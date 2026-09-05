<script setup lang="ts">
  import { Button, Inline, Popconfirm } from '@hina-ui/vue'

  const sides = ['top', 'right', 'bottom', 'left'] as const
  const names = { top: '上方', right: '右侧', bottom: '下方', left: '左侧' }
</script>

<template>
  <Inline gap="sm">
    <Popconfirm v-for="side in sides" :key="side" title="确认这个位置？" :side="side">
      <Button variant="outline" tone="neutral">{{ names[side] }}</Button>
    </Popconfirm>
  </Inline>
</template>
