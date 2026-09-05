<script setup lang="ts">
  import { ref } from 'vue'
  import { AlertDialog, Button, Stack, Switch, Text } from '@hina-ui/vue'

  const fail = ref(false)
  const status = ref('')

  async function archive() {
    status.value = ''
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (fail.value) {
      status.value = '归档失败，请稍后再试。'
      throw new Error('archive failed')
    }
    status.value = '已归档。'
  }
</script>

<template>
  <Stack gap="md" align="start">
    <Switch v-model="fail">模拟失败</Switch>
    <AlertDialog
      title="归档这个项目？"
      description="归档后项目变为只读，可以随时恢复。"
      confirm-text="归档"
      @confirm="archive"
    >
      <Button variant="outline" tone="neutral">归档项目</Button>
      <template #content>
        <Text v-if="status" tone="muted" size="sm">{{ status }}</Text>
      </template>
    </AlertDialog>
  </Stack>
</template>
