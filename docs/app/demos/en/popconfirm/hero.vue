<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Popconfirm, Stack, Text } from '@hina-ui/vue'

  const comments = ref([
    'Great chapter, looking forward to the next one.',
    'Is this plot different from the original?',
    'Bookmarked.',
  ])

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
        title="Delete this comment?"
        description="This cannot be undone."
        tone="danger"
        confirm-text="Delete"
        @confirm="remove(index)"
      >
        <Button size="sm" variant="ghost" tone="neutral">Delete</Button>
      </Popconfirm>
    </Stack>
    <Text v-if="!comments.length" tone="muted" size="sm">No comments left.</Text>
  </Stack>
</template>
