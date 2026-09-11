<script setup lang="ts">
  import { ref } from 'vue'
  import { AlertDialog, Button, Stack, Switch, Text } from '@hina-ui/vue'

  const fail = ref(false)
  const status = ref('')

  async function archive() {
    status.value = ''
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (fail.value) {
      throw new Error('Archiving failed, please try again later.')
    }
    status.value = 'Archived.'
  }
  function handleError(error: unknown) {
    status.value = error instanceof Error ? error.message : String(error)
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
      @error="handleError"
    >
      <Button variant="outline" tone="neutral">Archive project</Button>
      <template #content>
        <Text v-if="status" tone="muted" size="sm">{{ status }}</Text>
      </template>
    </AlertDialog>
  </Stack>
</template>
