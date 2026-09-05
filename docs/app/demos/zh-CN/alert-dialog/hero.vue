<script setup lang="ts">
  import { ref } from 'vue'
  import { AlertDialog, Button, Stack, Text } from '@hina-ui/vue'

  const removed = ref(false)

  async function remove() {
    await new Promise(resolve => setTimeout(resolve, 800))
    removed.value = true
  }
</script>

<template>
  <Stack gap="sm" align="start">
    <AlertDialog
      title="删除这篇文章？"
      description="删除后无法恢复，文章下的评论也会一并删除。"
      tone="danger"
      confirm-text="删除"
      @confirm="remove"
    >
      <Button variant="outline" tone="danger">删除文章</Button>
    </AlertDialog>
    <Text v-if="removed" tone="muted" size="sm">文章已删除。</Text>
  </Stack>
</template>
