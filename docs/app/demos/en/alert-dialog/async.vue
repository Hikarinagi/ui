<script setup lang="ts">
  import { ref } from 'vue'
  import { AlertDialog, Button, Stack, Switch, Text } from '@hina-ui/vue'

  const fail = ref(false)
  const status = ref('')

  async function archive() {
    status.value = ''
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (fail.value) {
      status.value = 'Archiving failed, please try again later.'
      throw new Error('archive failed')
    }
    status.value = 'Archived.'
  }
</script>

<template>
  <Stack gap="md" align="start">
    <Switch v-model="fail">Simulate a failure</Switch>
    <AlertDialog
      title="Archive this project?"
      description="An archived project becomes read-only and can be restored at any time."
      confirm-text="Archive"
      @confirm="archive"
    >
      <Button variant="outline" tone="neutral">Archive project</Button>
      <template #content>
        <Text v-if="status" tone="muted" size="sm">{{ status }}</Text>
      </template>
    </AlertDialog>
  </Stack>
</template>
