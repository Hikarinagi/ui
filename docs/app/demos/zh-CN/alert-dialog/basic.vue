<script setup lang="ts">
  import { ref } from 'vue'
  import { AlertDialog, Button, Stack, Text } from '@hina-ui/vue'

  const published = ref(false)
</script>

<template>
  <Stack gap="sm" align="start">
    <AlertDialog
      title="发布这篇文章？"
      description="发布之后所有人都能看到它。"
      confirm-text="发布"
      cancel-text="再想想"
      @confirm="published = true"
    >
      <Button variant="outline" tone="neutral">发布</Button>
    </AlertDialog>
    <Text v-if="published" tone="muted" size="sm">文章已发布。</Text>
  </Stack>
</template>
