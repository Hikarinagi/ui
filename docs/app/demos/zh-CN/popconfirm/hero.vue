<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Popconfirm, Stack, Text } from '@hina-ui/vue'

  const comments = ref(['写得真好，期待下一章。', '这段剧情和原作不一样吧？', '已收藏。'])

  function remove(index: number) {
    comments.value.splice(index, 1)
  }
</script>

<template>
  <Stack gap="sm" align="stretch" class="w-96">
    <Stack
      v-for="(comment, index) in comments"
      :key="comment"
      direction="row"
      align="center"
      justify="between"
      gap="sm"
    >
      <Text size="sm">{{ comment }}</Text>
      <Popconfirm
        title="删除这条评论？"
        description="删除后无法恢复。"
        tone="danger"
        confirm-text="删除"
        @confirm="remove(index)"
      >
        <Button size="sm" variant="ghost" tone="neutral">删除</Button>
      </Popconfirm>
    </Stack>
    <Text v-if="!comments.length" tone="muted" size="sm">没有评论了。</Text>
  </Stack>
</template>
