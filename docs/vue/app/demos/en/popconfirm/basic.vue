<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Popconfirm, Stack, Text } from '@hina-ui/vue'

  const done = ref(false)
</script>

<template>
  <Stack gap="sm" align="start">
    <Popconfirm title="Mark every notification as read?" @confirm="done = true">
      <Button variant="outline" tone="neutral">Mark all as read</Button>
    </Popconfirm>
    <Text v-if="done" tone="muted" size="sm">Everything was marked as read.</Text>
  </Stack>
</template>
