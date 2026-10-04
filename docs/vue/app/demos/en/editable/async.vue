<script setup lang="ts">
  import { ref } from 'vue'
  import { Editable, FormField, Stack, Switch, Text } from '@hina-ui/vue'

  const name = ref('Creator workspace')
  const fail = ref(false)
  const saved = ref(false)

  async function save(value: string) {
    saved.value = false
    if (!value.trim()) throw new Error('Enter a workspace name')
    await new Promise(resolve => setTimeout(resolve, 800))
    if (fail.value) throw new Error('Could not save. Disable the simulated failure and try again.')
    saved.value = true
  }
</script>

<template>
  <Stack class="w-full max-w-sm">
    <FormField
      label="Workspace name"
      description="Stay in edit mode while saving. A failed save keeps the draft for retry."
    >
      <Editable v-model="name" :on-save="save" submit-mode="enter" />
    </FormField>
    <FormField label="Simulate a failed save" orientation="horizontal">
      <Switch v-model="fail" />
    </FormField>
    <Text v-if="saved" role="status" size="sm" tone="muted">Workspace name saved.</Text>
  </Stack>
</template>
