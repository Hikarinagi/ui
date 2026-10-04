<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Popconfirm } from '@hina-ui/vue'

  const open = ref(false)
</script>

<template>
  <Inline gap="sm">
    <Button variant="outline" tone="neutral" @click="open = true">从外部打开</Button>
    <Popconfirm v-model:open="open" title="清空草稿？" description="草稿里的内容会被丢弃。">
      <Button variant="outline" tone="neutral">清空草稿</Button>
    </Popconfirm>
  </Inline>
</template>
