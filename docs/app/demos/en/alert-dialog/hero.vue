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
      title="Delete this article?"
      description="This cannot be undone, and the comments under it are deleted as well."
      tone="danger"
      confirm-text="Delete"
      @confirm="remove"
    >
      <Button variant="outline" tone="danger">Delete article</Button>
    </AlertDialog>
    <Text v-if="removed" tone="muted" size="sm">The article was deleted.</Text>
  </Stack>
</template>
