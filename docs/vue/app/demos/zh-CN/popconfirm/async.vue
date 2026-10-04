<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Popconfirm, Stack, Switch, Text } from '@hina-ui/vue'

  const fail = ref(false)
  const status = ref('')

  async function retry() {
    status.value = ''
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (fail.value) {
      status.value = '重试失败，请稍后再试。'
      throw new Error('retry failed')
    }
    status.value = '已重新发送。'
  }
</script>

<template>
  <Stack gap="md" align="start">
    <Switch v-model="fail">模拟失败</Switch>
    <Popconfirm title="重新发送这封邮件？" confirm-text="重发" @confirm="retry">
      <Button variant="outline" tone="neutral">重新发送</Button>
      <template #content>
        <Text v-if="status" tone="muted" size="sm">{{ status }}</Text>
      </template>
    </Popconfirm>
  </Stack>
</template>
