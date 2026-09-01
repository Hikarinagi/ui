<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Dialog, Text } from '@hikarinagi/ui'

  const open = ref(false)
  const submitting = ref(false)

  function submit() {
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      open.value = false
    }, 2000)
  }
</script>

<template>
  <Dialog
    v-model:open="open"
    title="Import a library"
    description="Please keep this dialog open while the import runs."
    :locked="submitting"
  >
    <Button variant="outline" tone="neutral">Import</Button>
    <template #content>
      <Text>
        {{
          submitting
            ? 'Importing. It closes on its own in two seconds.'
            : 'Starting the import locks the dialog for two seconds.'
        }}
      </Text>
    </template>
    <template #footer="{ close }">
      <Button variant="soft" tone="neutral" :disabled="submitting" @click="close">Cancel</Button>
      <Button :loading="submitting" @click="submit">Start import</Button>
    </template>
  </Dialog>
</template>
