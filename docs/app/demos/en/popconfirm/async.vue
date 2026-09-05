<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Popconfirm, Stack, Switch, Text } from '@hina-ui/vue'

  const fail = ref(false)
  const status = ref('')

  async function retry() {
    status.value = ''
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (fail.value) {
      status.value = 'Sending failed, please try again later.'
      throw new Error('retry failed')
    }
    status.value = 'Sent again.'
  }
</script>

<template>
  <Stack gap="md" align="start">
    <Switch v-model="fail">Simulate a failure</Switch>
    <Popconfirm title="Send this email again?" confirm-text="Resend" @confirm="retry">
      <Button variant="outline" tone="neutral">Resend</Button>
      <template #content>
        <Text v-if="status" tone="muted" size="sm">{{ status }}</Text>
      </template>
    </Popconfirm>
  </Stack>
</template>
