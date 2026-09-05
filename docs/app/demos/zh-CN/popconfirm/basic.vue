<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Popconfirm, Stack, Text } from '@hina-ui/vue'

  const done = ref(false)
</script>

<template>
  <Stack gap="sm" align="start">
    <Popconfirm title="把全部通知标记为已读？" @confirm="done = true">
      <Button variant="outline" tone="neutral">全部已读</Button>
    </Popconfirm>
    <Text v-if="done" tone="muted" size="sm">已全部标记为已读。</Text>
  </Stack>
</template>
